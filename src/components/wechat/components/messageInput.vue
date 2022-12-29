<template>
  <div id="input-main">
    <div class="inner-container">
      <ul class="left-icons">
        <li title="表情">
          <i class="iconfont icon-xiaolian" />
        </li>
        <li title="发送文件">
          <i class="el-icon-folder-opened" />
        </li>
        <li title="截图(Ctrl + alt + w & Alt + A)">
          <i class="el-icon-scissors" />
        </li>
        <li title="聊天记录">
          <i class="el-icon-chat-dot-round" />
        </li>
        <li v-show="message.trim() !== ''" @click="clear">
          <i class="el-icon-delete" title="清空输入框" />
        </li>
      </ul>

      <ul class="right-icons" v-if="chat.selectedUser ? user.id !== chat.selectedUser.id : false">
        <li title="语音聊天">
          <i class="el-icon-phone-outline" />
        </li>
        <li title="视频聊天">
          <i class="el-icon-video-camera" />
        </li>
      </ul>
      <div>
        <el-input
            type="textarea"
            :rows="3"
            size="medium"
            resize="none"
            ref="messageInput"
            @keyup.enter.native="listenSendMessage"
            v-model="message">
        </el-input>
      </div>
      <el-tooltip :disabled="message.trim() !== ''" trigger="click" class="item" content="不能发送空白信息" placement="top-end" effect="light">
        <div @click="sendMessage" class="send" title="按Enter键换行，按Ctrl+Enter键发送"><a href="javascript:">发送(S)</a></div>
      </el-tooltip>
    </div>
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
    ...mapState(['user', 'chat']),
  },
  methods: {
    // 清空输入框
    clear() {
      this.message = ''
    },
    // 快捷键发送
    listenSendMessage (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.sendMessage()
      }
    },
    sendMessage() {
      if(this.message.length && '' !== this.message.trim()) {
        const selectedUser = this.chat.selectedUser
        // 构建消息对象
        const messageObj = {
          to: selectedUser.loginName,
          toName: selectedUser.name,
          content: this.message,
          date: new Date(),
          self: true
        }
        this.clear()
        this.chat.selectedUser.lastMessage = messageObj.content
        this.chat.selectedUser.lastDate = messageObj.date
        // 本地添加一条消息记录
        const sessionKey = `${this.user.loginName}#${selectedUser.loginName}`
        if(!this.chat.session[sessionKey]) {
          this.chat.session[sessionKey] = []
        }
        this.chat.session[sessionKey].push(messageObj)
        this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(messageObj))
      }
    }
  },
  watch: {
    // 切换用户时，清空输入框
    'chat.selectedUser': {
      deep: true,
      immediate: true,
      handler(value) {
        this.clear()
        this.$nextTick(() => {
          // 输入框获取焦点
          this.$refs.messageInput.focus()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  //组件高度
  @input-height: 150px;

  #input-main {
    height: @input-height;
    width: 100%;
    border-top: 1px solid #E7E7E7;
    position: absolute;
    bottom: 0;
    z-index: 0;
    background: #F5F5F5;

    .inner-container {
      padding: 0 20px;
    }

    /* 图标集 */
    .left-icons li,.right-icons li {
      font-size: 20px;
      color: #5D5D5D;
      float: left;
      cursor: pointer;
      padding: 10px 0 8px 0;
    }
    .left-icons li {
      .icon-xiaolian {
        transform: scale(1.2);
        position: relative;
        top: -2px;
      }
      margin-right: 15px;
    }
    .right-icons {
      float: right;
      li {
        float: left;
        margin-left: 15px;
      }
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
