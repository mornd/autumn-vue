<template>
  <div id="aside-bar-main">
    <!-- 我的头像 -->
    <div class="avatar-container">
      <el-popover
          placement="right-start"
          width="200"
          v-model="tipVisible"
          trigger="click">
        <div>
          <div class="tip-wrap">
            <img @click="changeAvatar" :src="user.avatar | avatar" width="60" height="60">
            <div>
              <!-- 昵称 -->
              <span style="font-weight: bolder; color: #000"> {{ user.realName }} </span>
              <!-- 性别图标 -->
              <i
                  v-if="user.gender == gender.male || user.gender == gender.female"
                  :class="user.gender == gender.male ? 'fa fa-male' : 'fa fa-female'"
                  :style="{color: user.gender == gender.male ? '#409EFF' : 'red', marginLeft: '5px'}" />
              <br>
              <span>账号：</span><span>{{ user.loginName }}</span>
            </div>
          </div>
          <div class="tip-send" @click="sendSelf">发消息</div>
        </div>
        <img class="avatar" slot="reference" :src="user.avatar | avatar">
      </el-popover>
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
        <el-dropdown trigger="click" @command="handleMoreCommand" placement="bottom-start">
          <i class="el-icon-more-outline" />
          <el-dropdown-menu  slot="dropdown">
            <el-dropdown-item command="0">刷新本地缓存</el-dropdown-item>
            <el-dropdown-item command="1" v-has-role="['super_admin']"><span style="color: red">管理员清空所有人聊天记录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>

    <!--头像选择-->
    <el-dialog
        title="更换头像"
        :visible.sync="avatarVisible">
      <avatar-picker
          :avatarUrl="user.avatar"
          @uploadSuccess="closePicker" />
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getBadge} from "@/utils/chatUtil";
import { gender } from '@/constants/systemConsts'
import avatarPicker from '@/components/frame/info/avatarPicker'

export default {
  name: "asideBar",
  components: {
    avatarPicker
  },
  data() {
    return {
      getBadge,
      gender,
      tipVisible: false,
      avatarVisible: false,
    }
  },
  methods: {
    // 点击跳转右侧页面
    to(name) {
      this.chat.asideBarActive = name
    },
    // 更换头像
    changeAvatar() {
      this.avatarVisible = true
    },
    closePicker() {
      this.avatarVisible = false
    },
    // 给自己发消息
    sendSelf() {
      this.tipVisible = false
      const chat = this.chat
      if(chat.selectedUser == null || chat.selectedUser.id !== this.user.id) {
        let chatExist = false
        for (let i = 0; i< chat.recentUsers.length; i++) {
          if(this.user.id === chat.recentUsers[i].id) {
            if(!chat.recentUsers[i].lastDate) chat.recentUsers[i].lastDate = new Date()
            this.$store.commit('CHAT_TO_FIRST_CHOOSE', chat.recentUsers[i])
            chatExist = true
            break
          }
        }
        if(!chatExist) {
          // 不存在则去所有用户中查找
          for(let i = 0; i < chat.allFriends.length; i++) {
            if(this.user.id === chat.allFriends[i].id) {
              if(!chat.allFriends[i].lastDate) chat.allFriends[i].lastDate = new Date()
              this.$store.commit('CHAT_TO_FIRST_CHOOSE', chat.allFriends[i])
              break
            }
          }
        }
      }
    },
    handleMoreCommand(command) {
      switch (command) {
        case '0':
          this.chat.recentUsers = []
          this.chat.allFriends = []
          this.chat.session = {}
          this.$store.dispatch('getAllChatFriends')
          this.$store.dispatch('getRecentChatUsers')
          break;
        case '1':
          this.$confirm('确定要清空所有用户的聊天记录吗？', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.deleteRequest('/chat/clear').then(res => {
              if(res.success) {
                this.chat.recentUsers = []
                this.chat.session = {}
              }
            })
          }).catch(() => {});
          break
      }
    }
  },
  computed: {
    ...mapState(['user', 'chat']),
    //  获取未读消息的总数
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

  #aside-bar-main {
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
      left: 17px;
      bottom: 5px;
    }
  }

  // 个人信息 tips
  .tip-wrap {
    display: flex;
    justify-content: left;
    > img {
      border-radius: 5px;
      vertical-align: middle;
      cursor: pointer;
    }
    > div {
      margin-left: 12px;
      line-height: 30px;
      color: grey;
    }
  }

  // 发信息按钮
  .tip-send {
    background: #07C160;
    text-align: center;
    color: #FFF;
    width: 110px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    margin: 10px auto;
    cursor: pointer;
    position: relative;
    top: 5px;
    &:hover {
      background-color: #38CD7F;
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
