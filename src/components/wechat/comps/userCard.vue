<template>
  <div>
    <div class="main"
         :class="selectStyle"
         @click="selectUser(chatUser)">
      <div class="avatar-container">
        <el-badge :value="chatUser.unread | getBadge" :hidden="!chatUser.unread">
          <img class="avatar" :src="generateAvatar(chatUser.avatar)" />
        </el-badge>
      </div>
      <div class="info">
        <div>
          <span class="name" :title="chatUser.loginName">{{ chatUser.name }}</span>
          <span class="time">{{ chatDateFormatter(chatUser.lastDate) }}</span>
        </div>
        <span class="message">{{chatUser.lastMessage}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import { generateAvatar } from "@/utils/userUtil";
import { chatDateFormatter } from "@/utils/dateUtil";


export default {
  name: "userListBlock",
  data() {
    return {
      generateAvatar,
      chatDateFormatter
    }
  },
  methods: {
    selectUser(user) {
      if(this.chat.userSearch.trim() !== '') {
        this.chat.userSearch = ''
        this.$store.commit('CHAT_TO_FIRST_CHOOSE', user)
      } else {
        this.chat.selectedUser = user
      }
      if(this.chat.selectedUser.unread && this.chat.selectedUser.unread > 0) {
        this.chat.selectedUser.unread = undefined
        // 已读消息
        this.$api.putRequest(`/chat/read/${this.chat.selectedUser.loginName}`).then(res => {})
      }
    },
  },
  computed: {
    ...mapState(['user', 'chat']),
    selectStyle() {
      return {
        active: this.chat.selectedUser ? (this.chatUser.loginName === this.chat.selectedUser.loginName) : false,
        'mouse-move-up': this.chat.selectedUser ? (this.chatUser.loginName !== this.chat.selectedUser.loginName) : true
      }
    }
  },
  props: {
    chatUser: {
      type: Object,
      default: () => {},
      require: true,
    }
  },
  filters: {
    // 格式化红点
    getBadge(value) {
      return value ? (value < 100) ? value : '99+' : value
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    display: flex;
    justify-content: left;
    overflow: hidden;
    padding: 12px 14px 12px 12px;
    cursor: pointer;

    // 头像
    .avatar {
      @avatar-size: 41px;
      border-radius: 3px;
      vertical-align: middle;
      width: @avatar-size;
      height: @avatar-size;
    }

    .info {
      width: 100%;
      margin-left: 12px;
      overflow: hidden;
      position: relative;

      // 名称
      .name {
        font-size: 15px;
        position: absolute;
        left: 0;
        top: -2px;
      }

      // 时间
      .time {
        position: absolute;
        right: 0;
        color: #9999A8;
        font-size: 12px;
        letter-spacing: 1px;
      }

      // 消息
      .message {
        font-size: 12px;
        position: absolute;
        color: #9999A8;
        bottom: 0;
      }
    }
  }

  /*  鼠标移上样式 */
  .mouse-move-up:hover {
    background-color: #DCDADA;
  }

  /* 选中的聊天对象 */
  .active {
    background: #C5C4C4;
  }

</style>

<style scoped>
  >>> .el-badge__content {
    background-color: #FA5151;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 1%;
    height: 14px;
    line-height: 14px;
    padding: 0 4px;
    text-align: center;
    white-space: nowrap;
    transform: translateY(-50%) translateX(95%);
    border: none;
  }
</style>
