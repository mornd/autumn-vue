<template>
  <div class="main">
    <!-- 我的头像 -->
    <div class="avatar-container">
      <img class="avatar" :src="user.avatar | avatar">
    </div>

    <!-- 工具栏 -->
    <ul>
      <li title="聊天" @click="to('chat')">
        <el-badge :value="getBadge(getUnread)" :hidden="getUnread <= 0">
          <i :class="chat.asideBarActive === 'chat' ? 'fa fa-comment active' : 'fa fa-comment-o'" />
        </el-badge>
      </li>
      <li title="通讯录" @click="to('users')">
        <i :class="chat.asideBarActive === 'users' ? 'fa fa-user active' : 'fa fa-user-o'" />
      </li>
      <li>
        <i title="文件" class="el-icon-folder-opened" />
      </li>
    </ul>

    <!-- 底部 -->
    <ul class="bottom-tool">
      <li title="手机">
        <i class="el-icon-mobile" />
      </li>
      <li title="更多">
        <i class="el-icon-more-outline" />
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getBadge} from "@/utils/chatUtil";

export default {
  name: "asideBar",
  data() {
    return {
      getBadge
    }
  },
  methods: {
    // 点击跳转右侧页面
    to(name) {
      this.chat.asideBarActive = name
    }
  },
  computed: {
    ...mapState(['user', 'chat']),
    getUnread() {
      let count = 0
      let arr = this.chat.recentUsers
      if(arr) {
        arr.forEach(i => {
          if(i.unread > 0) count += i.unread
        })
      }
      return count === 0 ? undefined : count
    }
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
  // 当前激活选项
  .active {
    color: #07C160;
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
  transform: translateY(40%) translateX(95%);
  border: none;
}
</style>
