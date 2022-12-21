<template>
  <div>
    <div class="main"
         :class="selectStyle"
         @click="changeSelectChatUser(chatUser)">
      <div class="avatar-container">
        <el-badge :is-dot="isDot[user.loginName + '#' +  chatUser.loginName]" class="item">
          <img class="avatar" :src="generateAvatar(chatUser.avatar)" :alt="chatUser.name" :title="chatUser.loginName" />
        </el-badge>
      </div>
      <div class="info">
        <div>
          <span class="name">{{ chatUser.name }}</span>
          <span class="time">20:21</span>
        </div>
        <span class="message">哈哈哈哈哈哈哈哈哈</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import { generateAvatar } from "@/utils/userUtil";


export default {
  name: "userListBlock",
  data() {
    return {
      generateAvatar,
    }
  },
  methods: {
    changeSelectChatUser(user) {
      this.$store.commit('changeSelectChatUser', user)
    },
  },
  computed: {
    ...mapState(['chatUserList', 'selectChatUser', 'isDot', 'user']),
    selectStyle() {
      return {
        active: this.selectChatUser ? (this.chatUser.loginName === this.selectChatUser.loginName) : false,
        'mouse-move-up': this.selectChatUser ? (this.chatUser.loginName !== this.selectChatUser.loginName) : false
      }
    }
  },
  props: {
    chatUser: {
      type: Object,
      default: () => {},
      require: true,
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
