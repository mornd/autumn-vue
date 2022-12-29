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
import asideBar from "./components/asideBar";
import userList from "./components/userList";
import message from "./components/message";
import {mapState} from "vuex";

export default {
  name: "index",
  data () {
    return {
      width: '880px',
      screenFull: false,
    }
  },
  components: {
    asideBar,
    userList,
    message
  },
  mounted() {
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
  },
  computed: {
    ...mapState(['chat'])
  },
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
    width: 100%;
    min-height: 600px;
    min-width: 880px;
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
