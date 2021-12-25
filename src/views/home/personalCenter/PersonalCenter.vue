<template>
  <div class="container c-center-between">
    <div class="left">
      <el-card class="box-card">
        <!--<div slot="header" class="clearfix">
          <span style="font-weight: bold">个人信息</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>-->

      </el-card>
    </div>
    <div class="right">
      <el-card class="box-card">
        <el-tabs v-model="rightInfo">
          <el-tab-pane label="个人信息" name="info">
            <change-info/>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="pwd">
            <change-password v-if="rightInfo === 'pwd'"/>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
  import ChangeInfo from './ChangeInfo'
  import ChangePassword from './ChangePassword'
  import { mapGetters } from 'vuex'

  export default {
    name: "PersonalCenter",
    components: {ChangePassword, ChangeInfo},
    data() {
      return {
        rightInfo: 'info'
      }
    },
    computed: {
      //用户信息
      ...mapGetters(['user'])
    }
  }
</script>

<style lang="less" scoped>
  .container {
    .left {
      width: 450px;
      margin-right: 15px;
    }
    .right {
      width: 100%;
    }
  }


  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
  }
</style>