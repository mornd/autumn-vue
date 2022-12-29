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
            <span class="text">
              {{item.content}}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {chatDateFormatter} from "@/utils/dateUtil";

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
        this.session = value[this.user.loginName + '#' + this.chat.selectedUser.loginName]
      }
    },
    'chat.selectedUser': {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        const sessionKey = `${this.user.loginName}#${newVal.loginName}`
        if(this.chat.session[sessionKey] === undefined) {
          this.$api.getRequest(`/chat/getSession/${newVal.loginName}`).then(res => {
            if(res.success) {
              this.$set(this.chat.session, sessionKey, res.data)
            }
          })
        } else {
          this.session = this.chat.session[this.user.loginName + '#' + newVal.loginName]
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
    }
    .text {
      white-space: normal;
      display: inline-block;
      padding: 10px;
      max-width: 80%;
      border-radius: 5px;
      line-height: 20px;
    }
    /* 对方的聊天消息 */
    .message {
      .avatar {
        float: left;
        margin: 0 10px 0 0;
      }
      .text {
        background-color: #FFF;
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
        background-color: #95EC69;
        text-align: left;
      }
    }
  }
</style>
