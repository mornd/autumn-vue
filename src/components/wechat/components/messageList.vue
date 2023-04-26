<template>
  <div>
    <div class="main">
      <ul>
        <li v-for="item in session">
          <p class="time">
            <span>{{ chatDateFormatter(item.date) }}</span>
          </p>
          <div class="message" :class="{self: item.self}">
            <img class="avatar" :src="(item.self ? user.avatar : chat.selectedUser.avatar) | avatar" :alt="user.name" />
            <div>
              <i v-if="item.self && item.failure" class="el-icon-warning failure-icon" title="发送失败" />
              <i class="el-icon-caret-right self-text" v-if="item.self" />
              <i class="el-icon-caret-left other-text" v-else />
              <span class="text" v-text="item.content"></span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {chatDateFormatter} from "@/utils/dateUtil";
import {getSessionCache} from "@/utils/chatUtil";

export default {
  name: 'messageList',
  data () {
    return {
      chatDateFormatter,
      session: []
    }
  },
  computed: {
    ...mapState(['user', 'chat']),
  },
  watch: {
    'chat.session': {
      deep: true,
      immediate: true,
      handler(value) {
        this.session = []
        this.session = value[this.user.loginName + '#' + this.chat.selectedUser.loginName]
      }
    },
    'chat.selectedUser': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.session = []
        const sessionKey = `${this.user.loginName}#${newVal.loginName}`
        // 缓存聊天消息
        const sessionCache = getSessionCache()
        if(sessionCache) {
          this.chat.session = JSON.parse(sessionCache)
        }
        if(this.chat.session[sessionKey] === undefined) {
          this.$api.getRequest(`/chat/getSession/${newVal.loginName}`).then(res => {
            if(res.success) {
              this.$set(this.chat.session, sessionKey, res.data)
            }
          })
        } else {
          this.session = this.chat.session[sessionKey]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    height: 100%;
    padding: 10px 20px 20px 20px;
    ul li {
      padding: 0;
    }
    /* 聊天时间 */
    .time {
      text-align: center;
      letter-spacing: 1px;
      > span {
        display: inline-block;
        padding: 2px 5px;
        font-size: 10px;
        color: #FFF;
        background-color: #DADADA;
        border-radius: 2px;
      }
    }

    /* 通用样式 */
    .avatar {
      @avatar-size: 35px;
      width: @avatar-size;
      height: @avatar-size;
      border-radius: 3px;
      cursor: pointer;
      // 相邻兄弟选择器,下一个兄弟
      + div {
        position: relative;
      }
    }
    .text {
      white-space: pre-wrap; // 展示换行
      word-wrap: break-word;
      word-break: break-all; // 设置文字超出换行
      overflow: hidden;
      display: inline-block;
      padding: 10px;
      max-width: 80%;
      border-radius: 5px;
      line-height: 20px;
    }

    // 自己发的消息字体颜色
    @selfTextColor: #95EC69;
    // 对方消息字体颜色
    @otherTextColor: #FFF;

    /* 对方的聊天消息 */
    .message {
      .avatar {
        float: left;
        margin: 0 10px 0 0;
      }
      // 发送失败的图标
      .failure-icon {
        color: #DB5860;
        margin-right: 5px;
      }
      .text {
        background-color: @otherTextColor;
        font-size: 14px;
      }
    }

    /*  自己的聊天消息 */
    .self {
      text-align: right;
      .avatar {
        float: right;
        margin: 0 0 0 10px;
      }
      .text {
        background-color: @selfTextColor;
        text-align: left;
      }
    }

    // 消息两侧的三角形图标
    .self-text {
      position: absolute;
      top: 10px;
      color: @selfTextColor;
      right: 35.5px;
    }
    .other-text {
      position: absolute;
      top: 10px;
      color: @otherTextColor;
      left: 35.5px;
    }
  }
</style>
