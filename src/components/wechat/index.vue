<template>
  <div>
    <div class="container" :style="{width}">
      <div>
        <aside-bar />
      </div>
      <div>
        <userList />
      </div>
      <div class="message">
        <message @zoom="zoom"/>
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
      width: '880px',
      screenFull: false,
    }
  },
  mounted:function() {
    this.$store.dispatch('initChatFriends');
  },
  components: {
    asideBar,
    userList,
    message
  },
  methods: {
    zoom() {
      if(this.screenFull) {
        this.width = '880px'
      } else {
        this.width = '100%'
      }
      this.screenFull = !this.screenFull
    }
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
    height: 100%;
    display: flex;
    justify-content: left;
    overflow: hidden;
    margin: 0 auto;
    border: 2px solid #E7E7E7;
    border-radius: 2px;
    //box-shadow: 0 2px 2px rgba(0,0,0,0.1);

    .message {
      width: 100%;
    }
  }
</style>
