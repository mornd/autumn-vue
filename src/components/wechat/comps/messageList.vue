<template>
  <div>
    <div class="main" v-scroll-bottom="sessions">
      <ul>
        <li v-for="item in sessions[user.loginName + '#' + selectChatUser.loginName]">
          <p class="time">
            <span>{{item.date | time}}</span>
          </p>
          <div class="message" :class="{self: item.self}">
            <img class="avatar" :src="generateAvatar(item.self ? user.avatar : selectChatUser.avatar)" :alt="user.name" />
            <span class="text">
              {{item.content}}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { generateAvatar } from "@/utils/userUtil";

export default {
  name: 'messageList',
  data () {
    return {
      generateAvatar
    }
  },
  computed: {
    ...mapState(['sessions', 'user', 'selectChatUser']),
  },
  methods: {
  },
  filters:{
    time (date) {
      if (date) {
        date = new Date(date);
      }
      return `${date.getHours()}:${date.getMinutes()}`;
    }
  },
  directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    'scroll-bottom' (el) {
      //console.log(el.scrollTop);
      setTimeout(function () {
        el.scrollTop+=9999;
      },1)
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    height: 368px;
    // 滚动条
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px 20px;
    ul li {
      padding: 0;
    }
    /* 聊天时间 */
    .time {
      text-align: center;
      > span {
        display: inline-block;
        padding: 2.5px 6px;
        font-size: 8px;
        color: #FFF;
        background-color: #DADADA;
        border-radius: 2px;
      }
    }

    /* 通用样式 */
    .avatar {
      @avatar-size: 35px;
      width: @avatar-size;
      height: @avatar-size;
      border-radius: 3px;
      cursor: pointer;
    }
    .text {
      display: inline-block;
      padding: 10px;
      max-width: 80%;
      border-radius: 5px;
      line-height: 20px;
    }
    /* 对方的聊天消息 */
    .message {
      .avatar {
        float: left;
        margin: 0 10px 0 0;
      }
      .text {
        background-color: #FFF;
        font-size: 14px;
      }
    }

    /*  自己的聊天消息 */
    .self {
      text-align: right;
      .avatar {
        float: right;
        margin: 0 0 0 10px;
      }
      .text {
        background-color: #95EC69;
        text-align: left;
      }
    }
  }
</style>
