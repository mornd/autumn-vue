<template>
  <div>
    <div class="main">
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
  }
}
</script>

<style lang="less" scoped>
  .main {
    height: 100%;
    padding: 10px 20px 20px 20px;
    ul li {
      padding: 0;
    }
    /* 聊天时间 */
    .time {
      text-align: center;
      > span {
        display: inline-block;
        padding: 3px 8px;
        font-size: 10px;
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
