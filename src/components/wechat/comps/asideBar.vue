<template>
  <div class="main">
    <!-- 我的头像 -->
    <div class="avatar-container">
      <img class="avatar" :src="user.avatar" :alt="user.name" :title="user.name">
    </div>

    <!-- 工具栏 -->
    <ul>
      <li title="聊天" @click="chat('a1')">
        <i :class="active === 'a1' ? 'fa fa-comment active' : 'fa fa-comment-o'"></i>
      </li>
      <li title="通讯录" @click="users('a2')">
        <i :class="active === 'a2' ? 'fa fa-user active' : 'fa fa-user-o'"></i>
      </li>
      <li>
        <i class="fa fa-file-text-o"></i>
      </li>
    </ul>

    <ul class="bottom-tool">
      <li>
        <i class="fa fa-comment-o"></i>
      </li>
      <li>
        <i class="fa fa-th-list"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "asideBar",
  data() {
    return {
      active: 'a1'
    }
  },
  methods: {
    chat(n) {
      this.active = n
    },
    users(n) {
      this.active = n
    }
  },
  computed: {
    ...mapState(['user']),
  }
}
</script>

<style lang="less" scoped>
  // 背景颜色
  @bg: #2E2E2E;
  // 头像尺寸
  @avatar-size: 35px;

  .main {
    overflow: hidden;
    height: 100%;
    width: 54px;
    background-color: @bg;
    position: relative;

    .avatar-container {
      width: 35px;
      margin: 0 auto;
      margin-top: 40px;

      // 头像
      .avatar{
        width: @avatar-size;
        height: @avatar-size;
        cursor: pointer;
      }
    }
    ul {
      margin-top: 12px;
    }
    ul li {
      @height: 45px;
      width: 100%;
      margin: 0 auto;
      height: @height;
      line-height: @height;
      font-weight: unset;
      font-size: 18px;
      text-align: center;
      color: #888;
      cursor: pointer;
    }
    ul li:hover {
      color: #ccc;
    }

    // 底部工具栏
    .bottom-tool {
      position: absolute;
      left: 19px;
      bottom: 5px;
    }
  }
  // 当前激化选项
  .active {
    color: #07C160;
  }
</style>
