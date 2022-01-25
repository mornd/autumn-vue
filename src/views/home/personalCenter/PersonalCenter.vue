<template>
  <div class="container c-center-between">
    <!--左侧用户信息-->
    <div class="left">
      <el-card class="box-card">
        <div
          class="avatar-frame"
          @mouseover="() => maskVisible = true"
          @mouseleave="() => maskVisible = false"
        >
          <!--图片-->
          <el-image
            @click="avatarClick"
            :src="userAvatar"
            fit="cover"
            class="avatar"
          >
          </el-image>

          <!--遮罩层-->
          <div
            v-show="maskVisible"
            class="avatar-mask"
            @click="avatarClick"
          >
            更换头像
          </div>
          <!--性别-->
          <div
            class="gender"
            :title="user.gender == gender.male ? '男' : '女'"
            :style="{backgroundColor: user.gender == gender.male ? '#409EFF' : 'red'}"
          >
            <i :class="user.gender == gender.male ? 'el-icon-male' : 'el-icon-female'" style="color: #FFF; font-weight: bold"></i>
          </div>
        </div>

        <ul class="name">
          <!--登录名-->
          <li>{{user.loginName}}</li>
          <!--姓名-->
          <li style="font-size: 13px; color: #666">{{user.realName}}</li>
        </ul>

        <ul class="base-info-ul">
          <li>
            <p class="c-center-between">
              <span><i class="fa fa-user-o"></i>年龄</span>
              <span>{{user.birthday | showAge}}</span>
            </p>
          </li>
          <li>
            <p class="c-center-between">
              <span><i class="fa fa-phone"></i>电话</span>
              <span>{{user.phone ? user.phone : '空'}}</span>
            </p>
          </li>
          <li>
            <p class="c-center-between">
              <span><i class="fa fa-envelope-open-o"></i>邮箱</span>
              <span>{{user.email ? user.email : '空'}}</span>
            </p>
          </li>
        </ul>


      </el-card>
    </div>

    <!--右侧操作区域-->
    <div class="right">
      <el-card class="box-card">
        <el-tabs v-model="rightInfo">
          <el-tab-pane label="个人信息" name="info">
            <change-info/>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="pwd">
            <change-password v-if="rightInfo === 'pwd'"/>
          </el-tab-pane>
          <el-tab-pane label="登录记录" name="log">
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>


    <!--头像选择-->
    <el-dialog
      title="更换头像"
      :visible.sync="avaterVisible"
      width="40%">
      <avater-pincker></avater-pincker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avaterVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">上 传</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import ChangeInfo from './ChangeInfo'
  import ChangePassword from './ChangePassword'
  //头像选择
  import avaterPincker from './avaterPicker'
  import { mapGetters } from 'vuex'
  import { birthdayToAge } from '@/utils/objUtil'
  import { gender } from '@/constants/systemConsts'
  import defaultAvatar from '@/assets/images/avatar/defaultAvatar.png'

  export default {
    name: "PersonalCenter",
    components: {ChangePassword, ChangeInfo, avaterPincker},
    data() {
      return {
        rightInfo: 'info',
        //左侧卡片相关
        defaultAvatar,
        maskVisible: false,
        avaterVisible: false,
        gender,
      }
    },
    methods: {
      avatarClick() {
        this.avaterVisible = true
      }
    },
    computed: {
      //用户信息
      ...mapGetters(['user']),
      userAvatar() {
        return this.user.avatar ? this.user.avatar : this.defaultAvatar
      }
    },
    filters: {
      //将生日格式为年龄
      showAge(birthday) {
        return birthday ? birthdayToAge(birthday) : '未知'
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    .left {
      width: 450px;
      margin-right: 15px;
      //头像宽高
      @avatarWidth: 110px;
      @avatarHeight: 110px;
      @genderWidth: 25px;
      @genderHeight: 25px;

      //混入
      .mixin_avatar() {
      width: @avatarWidth;
      height: @avatarHeight;
      border-radius: 50%;
      }

      //左侧头像框
      .avatar-frame {
        .mixin_avatar();
        margin: 20px auto 0;
        box-shadow: 0 0 6px rgb(0 21 41 / 35%);
        position: relative;
        z-index: 1;
        //头像
        .avatar {
          .mixin_avatar();
          position: relative;
          z-index: 10;
        }
        .avatar-mask {
          .mixin_avatar();
          //opacity: .5;
          background-color: rgba(0,0,0,.4); //改变背景透明度的同时不更改字体透明度
          line-height: @avatarHeight;
          text-align: center;
          cursor: pointer;
          position: absolute;
          color: #FFF;
          top: 0;
          z-index: 20;
        }
        //性别
        .gender {
          width: @genderWidth;
          height: @genderHeight;
          border-radius: 50%;
          border: solid #FFF 2px;
          text-align: center;
          line-height: @genderWidth;
          position: absolute;
          bottom: -2px;
          right: 4px;
          z-index: 100;
        }
      }

      .name {
        text-align: center;
        font-size: 22px;
        color: #333;
        letter-spacing: 1px;
        li {
          margin-top: 20px;
        }
      }

      .base-info-ul {
        font-size: 13px;
        color: #303133;
        margin-top: 50px;
        li {
          border-bottom: #F0F3F4 solid 1px;
          i {
            margin-right: 8px;
          }
        }
      }
    }

    .right {
      width: 100%;
    }
  }
</style>