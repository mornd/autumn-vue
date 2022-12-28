<template>
  <div id="message-container">
    <div class="main">
      <div class="header">
        <span class="name">{{ chat.selectedUser ? chat.selectedUser.name : '' }}</span>
      </div>

      <div class="icons">
        <ul>
          <li title="最小化"><i class="el-icon-minus"></i></li>
          <li @click="zoom" title="最大化"><i class="el-icon-full-screen"></i></li>
          <li title="关闭" @click="close"><i class="el-icon-close"></i></li>
        </ul>

        <!--  更多按钮 -->
        <i class="el-icon-more more" v-if="chat.selectedUser ? user.id !== chat.selectedUser.id : false"/>
      </div>

      <div class="message-list" v-if="chat.selectedUser" ref="scrollElement">
        <!-- 消息列表展示 -->
        <message-list />
      </div>
      <!-- 空内容 -->
      <div v-else class="empty">
        <i class="fa fa-wechat" />
      </div>
    </div>

    <!-- 用户输入框 -->
    <message-input v-if="chat.selectedUser" />
  </div>
</template>

<script>
import messageList from "./messageList";
import messageInput from "./messageInput";
import {mapState} from "vuex";

export default {
  name: "message",
  data() {
    return {
    }
  },
  components: {
    messageList,
    messageInput
  },
  computed: {
    ...mapState(['user', 'chat']),
  },
  methods: {
    // 滚动条移至最顶部
    handleScrollTop() {
      this.$nextTick(() => {
        let scrollElem = this.$refs.scrollElement;
        if(scrollElem) {
          scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    },
    // 滚动条移至最底部
    handleScrollBottom() {
      this.$nextTick(() => {
        let scrollElem = this.$refs.scrollElement;
        if(scrollElem) {
          scrollElem.scrollTo({ top: scrollElem .scrollHeight, behavior: 'smooth' });
        }
      });
    },
    // 尺寸缩放
    zoom() {
      this.$emit('zoom')
    },
    // 关闭窗口
    close() {
      this.$router.go(-1)
    }
  },
  watch: {
    'chat.selectedUser': {
      handler(oldVal, newVal) {
        this.handleScrollBottom()
      },
      // 深度监听
      deep: true,
      // 页面首次加载也执行一次
      immediate: true
    },
    'chat.session': {
      handler(oldVal, newVal) {
        this.handleScrollBottom()
      },
      // 深度监听
      deep: true,
      // 页面首次加载也执行一次
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
  //  头部区域高度
  @header-height: 60px;
  // 消息输入部分高度
  @message-input-height: 150px;

  #message-container {
    background: #F5F5F5;
    position: relative;
    height: 100%;

    .main {
      position: relative;
      border-left: 1px solid #E7E7E7;
      height: 100%;
      .header {
        height: @header-height;
        border-bottom: 1px solid #E7E7E7;

        /* 对方聊天名称 */
        .name {
          line-height: @header-height;
          font-size: 21px;
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

      /*  消息列表 */
      .message-list {
        overflow-x: hidden;
        // 高度 = 总高度 - 头部 - 底部输入框部分
        height: calc(100% - @header-height - @message-input-height);
        overflow-y: overlay;
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
  }
</style>
