<template>
  <div class="main">
    <div class="header">
      <div class="header-wrap">
        <el-input
            class="search"
            placeholder="搜索"
            v-model="search"
            size="mini"
            clearable>
          <i slot="prefix" class="el-input__icon el-icon-search wechat-icon-bg"></i>
        </el-input>
        <div title="发起群聊" class="group-chat">
          <i class="el-icon-plus"></i>
        </div>
      </div>
    </div>

    <div class="user-list">
        <ul>
          <li v-for="(item,index) in chatUserList" :key="index">
            <userListBlock :chatUser="item"/>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>

import userListBlock from "./userListBlock";
import {mapState} from "vuex";

export default {
  name: "userList",
  components: {
    userListBlock
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState(['chatUserList', 'selectChatUser', 'user']),
  },
}
</script>

<style lang="less" scoped>
  @header-height: 60px;

  .main {
    // 显示滚动条
    height: 100%;
    width: 250px;
    overflow: hidden;
    background-color: #E4E4E6;

    /* 头部搜索区域 */
    .header {
      height: @header-height;
      background: #F7F7F7;
      overflow: hidden;
      border-bottom: 1px solid #E7E7E7;
      .header-wrap {
        position: relative;
        width: 226px;
        margin: 0 auto;
        margin-top: 18px;

        // 搜索输入框
        .search {
          width: 185px;
        }

        // 群聊按钮
        .group-chat {
          @btn-size: 28px;
          position: absolute;
          right: 0;
          display: inline-block;
          background: #E2E2E2;
          height: @btn-size;
          line-height: @btn-size;
          width: @btn-size;
          color: #646464;
          border-radius: 5px;
          text-align: center;
          cursor: pointer
        }

        .group-chat:hover {
          background: #DCDADA;
        }
      }
    }

    // 好友列表
    .user-list {
      height: calc(100% - @header-height);
      overflow-y: overlay;
    }
  }


  /**
    el 搜索框
   */
  /deep/ .el-input__inner {
    border: none;
    background: #E2E2E2;
  }

  /deep/ .el-input__inner:focus {
    border: 1px solid #bbb;
  }

  /deep/ .el-input__inner::placeholder, .wechat-icon-bg {
    color: #646464;
  }
</style>
