<template>
  <div>
    <div class="main"
         :class="selectStyle"
         @contextmenu.prevent="onContextmenu"
         @click="selectUser(chatUser)">
      <div class="avatar-container" :title="chatUser.loginName">
        <el-badge :value="getBadge(chatUser.unread)" :hidden="!chatUser.unread">
          <img class="avatar" :src="chatUser.avatar | avatar" />
        </el-badge>
      </div>
      <div class="info">
        <div>
          <span class="name" :title="chatUser.name">{{ chatUser.name }}</span>
          <span class="time">{{ chatDateFormatter(chatUser.lastDate) }}</span>
        </div>
        <span class="message">{{ chatUser.lastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import { chatDateFormatter } from "@/utils/dateUtil";
import {getBadge} from "@/utils/chatUtil";
import {toFirstChoose} from "@/utils/chatUtil";

export default {
  name: "userListBlock",
  data() {
    return {
      chatDateFormatter,
      getBadge
    }
  },
  methods: {
    selectUser(user) {
      if(this.chat.userSearch.trim() !== '') {
        this.chat.userSearch = ''
        toFirstChoose(user)
      } else {
        this.chat.selectedUser = user
      }
      if(this.chat.selectedUser.unread > 0) {
        this.chat.selectedUser.unread = undefined
        // 已读消息
        this.$api.putRequest(`/chat/read/${this.chat.selectedUser.loginName}`).then(res => {})
      }
    },
    // 右键菜单
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "消息免打扰",
            onClick: () => {
            }
          },
          {
            label: "删除聊天",
            onClick: () => {
              this.$confirm(`确定要删除与${this.chatUser.name}的聊天吗?`, '系统提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$api.deleteRequest(`/chat/delete/${this.chatUser.loginName}`).then(res => {
                  if(res.success) {
                    for (let i = 0; i < this.chat.recentUsers.length; i++) {
                      if(this.chatUser.id === this.chat.recentUsers[i].id) {
                        // 删除
                        this.chat.recentUsers.splice(i, 1)
                        this.chat.selectedUser = null
                        break
                      }
                    }
                    // 清空本地缓存
                    this.$set(this.chat.session, `${this.user.loginName}#${this.chatUser.loginName}`, undefined)
                  }
                })
              });
            }
          }
        ],
        event, // 鼠标事件信息
        customClass: "contextmenu_class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 100 // 主菜单最小宽度
      });
      return false;
    }
  },
  computed: {
    ...mapState(['user', 'chat']),
    selectStyle() {
      return {
        active: this.chat.selectedUser ? (this.chatUser.loginName === this.chat.selectedUser.loginName) : false,
        'mouse-move-up': this.chat.selectedUser ? (this.chatUser.loginName !== this.chat.selectedUser.loginName) : true
      }
    }
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
      @avatar-size: 41px;
      border-radius: 3px;
      vertical-align: middle;
      width: @avatar-size;
      height: @avatar-size;
    }

    .info {
      width: 100%;
      margin-left: 12px;
      overflow: hidden;
      position: relative;

      // 名称
      .name {
        width: 105px;
        white-space:nowrap; //不换行
        text-overflow: ellipsis; //超出的显示省略号
        overflow:hidden; //超出部分隐藏
        word-wrap:normal; //长单词不换行-兼容ie
        font-size: 15px;
        position: absolute;
        left: 0;
        top: -2px;
      }

      // 时间
      .time {
        position: absolute;
        right: 0;
        color: grey;
        font-size: 12px;
        letter-spacing: 1px;
      }

      // 消息
      .message {
        // 这里是固定的宽度
        width: 171px;
        white-space:nowrap; //不换行
        text-overflow: ellipsis; //超出的显示省略号
        overflow:hidden; //超出部分隐藏
        word-wrap:normal; //长单词不换行-兼容ie
        font-size: 12px;
        position: absolute;
        color: grey;
        bottom: 0;
      }
    }
  }

  /*  鼠标移上样式 */
  .mouse-move-up:hover {
    background-color: #DCDADA;
  }

  /* 选中的聊天对象 */
  .active {
    background: #C5C4C4;
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
    transform: translateY(-50%) translateX(95%);
    border: none;
  }
</style>

<!--  右键菜单 -->
<style>
  /*   每一项 item */
  .contextmenu_class .menu_item{

  }
  .contextmenu_class .menu_item__available:hover,
  .contextmenu_class .menu_item_expand {
    background: #E2E2E2;
    color: #000;
  }
</style>
