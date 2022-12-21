<template>
  <div>
    <div class="main">
      <div class="header">
        <span class="name">{{ selectChatUser ? selectChatUser.name : '' }}</span>
      </div>

      <div class="icons">
        <ul>
          <li title="最小化"><i class="el-icon-minus"></i></li>
          <li title="最大化"><i class="el-icon-full-screen"></i></li>
          <li title="关闭" @click="close"><i class="el-icon-close"></i></li>
        </ul>

        <!--  更多按钮 -->
        <i class="el-icon-more more" />
      </div>
      <div>
        <div v-if="selectChatUser">
          <div>

            <!-- 消息列表展示 -->
            <messageList />
          </div>
          <div>

            <!-- 用户输入框 -->
            <message-input />
          </div>
        </div>

        <!-- 空内容 -->
        <div v-else class="empty">
          <i class="fa fa-wechat" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messageList from "./messageList";
import messageInput from "./messageInput";
import {mapState} from "vuex";

export default {
  name: "message",
  components: {
    messageList,
    messageInput
  },
  computed: {
    ...mapState(['selectChatUser', 'user']),
  },
  methods: {
    close() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    height: 100%;
    position: relative;
    border-left: 1px solid #E7E7E7;
    .header {
      height: 60px;
      width: 100%;
      border-bottom: 1px solid #E7E7E7;

      /* 对方聊天名称 */
      .name {
        line-height: 60px;
        font-size: 19px;
        margin-left: 22px;
      }
    }

    .icons {
      position: absolute;
      top: 0;
      right: 0;
      ul li {
        float: left;
        width: 33px;
        height: 25px;
        color: #5D5D5D;
        line-height: 25px;
        font-size: 15px;
        cursor: pointer;
        text-align: center;
      }

      ul li:not(last-child):hover {
        background-color: #DCDADA;
      }
      ul li:last-child:hover {
        background-color: #FB7373;
      }

      /* 更多按钮 */
      .more {
        color: #5D5D5D;
        line-height: 25px;
        font-size: 15px;
        cursor: pointer;
        position: absolute;
        right: 9px;
        top: 30px;
      }
      .more:hover {
        color: #303133;
      }
    }

    /* 空状态 */
    .empty {
      width: 100%;
      text-align: center;
      color: #EBEBEB;
      font-size: 80px;
      i {
        margin-top: 180px;
      }
    }
  }
</style>
