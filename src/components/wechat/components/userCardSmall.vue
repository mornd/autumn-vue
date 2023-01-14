<template>
  <div>
    <div class="main mouse-move-up"
         @click="selectUser(chatUser)" :title="chatUser.loginName">
      <div class="avatar-container">
        <img class="avatar" :src="chatUser.avatar | avatar"  />
        <span class="name" :title="chatUser.name">{{ chatUser.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {toFirstChooseById} from "@/utils/chatUtil";

export default {
  name: "userCardSmall",
  methods: {
    // 单击事件
    selectUser(user) {
      if(this.chat.userSearch.trim() !== '') this.chat.userSearch = ''
      this.chat.userListScrollTop = !this.chat.userListScrollTop
      //  将点击的用户放到聊天列表的第一行
      toFirstChooseById(user.id)
    },
  },
  computed: {
    ...mapState(['chat'])
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
    @avatar-size: 34px;
    border-radius: 3px;
    vertical-align: middle;
    width: @avatar-size;
    height: @avatar-size;
  }

  .name {
    margin-left: 12px;
  }
}

/*  鼠标移上样式 */
.mouse-move-up:hover {
  background-color: #DCDADA;
}
</style>
