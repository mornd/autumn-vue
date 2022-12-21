<template>
  <div id="input-main">
    <ul>
      <li title="表情">
        <div class="face">☻</div>
      </li>
      <li title="发送文件">
        <i class="el-icon-folder-opened" />
      </li>
      <li title="截图(Ctrl + alt + w & Alt + A)" style="font-size: 20px">
        <i class="el-icon-scissors"></i>
      </li>
      <li title="聊天记录">
        <i class="el-icon-chat-dot-round" />
      </li>
      <li v-show="message.trim() !== ''" @click="message = ''">
        <i class="el-icon-close" title="清空输入框" />
      </li>
    </ul>
    <div>
      <el-input
          type="textarea"
          :rows="3"
          size="medium"
          resize="none"
          @keyup.enter.native="listenSendMessage"
          v-model="message">
      </el-input>
    </div>
    <el-tooltip :disabled="message.trim() !== ''" trigger="click" class="item" content="不能发送空白信息" placement="top-end" effect="light">
      <div @click="sendMessage" class="send" title="按Enter键换行，按Ctrl+Enter键发送"><a href="javascript:">发送(S)</a></div>
    </el-tooltip>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "messageInput",
  data() {
    return {
      message: ''
    }
  },
  computed: {
    ...mapState(['user', 'selectChatUser']),
  },
  methods: {
    listenSendMessage (e) {
      console.log(e.ctrlKey);
      if (e.ctrlKey && e.keyCode ===13) {
        this.sendMessage()
      }
    },
    sendMessage() {
      if(this.message.length && '' !== this.message.trim()) {
        let messageObj = {
          to: this.selectChatUser.loginName,
          content: this.message,
          self: true
        }
        this.message = ''
        this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(messageObj))
        this.$store.commit('SEND_CHAT_MESSAGE', messageObj);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #input-main {
    padding: 0 20px;
    height: 148px;
    position: relative;

    /* 图标集 */
    ul li {
      .face {
        transform: scale(1.3);
        position: relative;
        top: -3px;
      }
      font-size: 20px;
      padding: 10px 0 8px 0;
      color: #5D5D5D;
      float: left;
      margin-right: 15px;
      cursor: pointer;
    }
    li:hover {
      color: #303133;
    }

    /*  发送按钮 */
    .send {
      width: 95px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #E9E9E9;
      border-radius: 4px;
      cursor: pointer;
      position: absolute;
      right: 20px;
      bottom: 10px;
      a {
        text-decoration: none;
        color: #07C160;
      }
    }
    .send:hover {
      background: #D2D2D2;
    }
  }

  /*  文本域 */
  /deep/ .el-textarea__inner {
    border: none;
    padding: 0;
    background: #F5F5F5;
  }
</style>
