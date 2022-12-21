<template>
  <div>
    <div class="container">
      <div>
        <aside-bar />
      </div>
      <div>
        <userList />
      </div>
      <div class="message">
        <message />
      </div>
    </div>
  </div>
</template>

<script>
import asideBar from "./comps/asideBar";
import userList from "./comps/userList";
import message from "./comps/message";

export default {
  name: "index",
  data () {
    return {
    }
  },
  mounted:function() {
    this.$store.dispatch('initChatFriends');
  },
  components: {
    asideBar,
    userList,
    message
  }
}

/*
* 对应微信的版本：3.8.1.26  (2022-12-21)
*
* */

// 安装socket js：npm install sockjs-client
// 安装stompjs：npm install stompjs
</script>

<style lang="less" scoped>
  .container {
    width: 880px;
    //width: 100%;
    height: 600px;
    display: flex;
    justify-content: left;
    overflow: hidden;
    margin: 0 auto;
    border: 2px solid #E7E7E7;
    border-radius: 2px;
    //box-shadow: 0 2px 2px rgba(0,0,0,0.1);

    .message {
      width: 100%;
      overflow:hidden;
    }
  }
</style>
