<template>
  <div>
    <div class="container" :style="modelStyle">
      <div>
        <aside-bar />
      </div>
      <div>
        <userList />
      </div>
      <div class="message">
        <message :model="model" @zoom="zoom"/>
      </div>
    </div>
  </div>
</template>

<script>
import asideBar from "./components/asideBar";
import userList from "./components/userList";
import message from "./components/message";
import {mapState} from "vuex";
import { toFirstChooseById } from "@/utils/chatUtil"

export default {
  name: "index",
  data () {
    return {
      // 收缩后宽度
      shrinkWidth: '900px',
      // 全屏高度
      fullHeight: '716px',
      // 宽度最大化，这里不是指全屏
      widthMax: false,
      // 全屏 === full
      model: this.$route.query.model,
      // 选中指定id的用户
      selectId: this.$route.query.selectId,
      modelStyle: {
        width: undefined,
        height: undefined,
      }
    }
  },
  mounted() {
    const value = sessionStorage.getItem('chat-widthMax')
    if(value !== null) this.widthMax = JSON.parse(value)
    this.modelStyle = {
      width: this.widthMax ? '100%' : this.shrinkWidth,
      height: this.model === 'full' ? this.fullHeight : '100%'
    }
    if(this.selectId) {
      // 将参数selectId对应的用户选中
      toFirstChooseById(this.selectId)
      // 清空 query 参数，否则再次刷新 wechat 页面还是会带上id
      // 先拷贝一个一模一样的对象
      let newQuery = JSON.parse(JSON.stringify(this.$route.query))
      //再删除参数
      delete newQuery.selectId
      this.$router.replace({ query: newQuery })
    }

    if(this.chat.selectedUser && this.chat.selectedUser.unread > 0) {
      this.chat.selectedUser.unread = undefined
      this.$api.putRequest(`/chat/read/${this.chat.selectedUser.loginName}`).then(res => {})
    }
  },
  components: {
    asideBar,
    userList,
    message
  },
  methods: {
    zoom() {
      if(this.widthMax) {
        this.modelStyle = {
          width: this.shrinkWidth,
          height: this.model === 'full' ? this.fullHeight : '100%',
        }
      } else {
        this.modelStyle = {
          width: '100%',
          height: this.model === 'full' ? this.fullHeight : '100%'
        }
      }
      this.widthMax = !this.widthMax
      sessionStorage.setItem('chat-widthMax', JSON.stringify(this.widthMax))
    }
  },
  computed: {
    ...mapState(['chat'])
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
    width: 100%;
    min-height: 600px;
    min-width: 900px;
    display: flex;
    justify-content: left;
    overflow: hidden;
    margin: 0 auto;
    border: 2px solid #E7E7E7;
    border-radius: 2px;
    //box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.1);

    .message {
      width: 100%;
    }
  }
</style>
