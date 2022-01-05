<template>
  <div>
    <!--对话框-->
    <el-dialog
      :visible.sync="transData.dialogVisible"
      :title="transData.title"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
        :disabled="currOper == operation.see"
        status-icon
        size="small"
      >
        <!--隐藏id项-->
        <el-form-item v-if="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="form.name" maxlength="10" clearable placeholder="请输入菜单标题"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model.trim="form.code" maxlength="10" clearable placeholder="请输入菜单标题">
            <template slot="prepend">{{ rolePrefix }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="角色排序" prop="sort">
          <el-tooltip
            :content="currOper === operation.see ? ('当前：' + form.sort) : '升序展示'"
            placement="top"
          >
            <el-input-number
              v-model="form.sort"
              :min="1"
              :step="1"
              :max="500"
              style="width: 100%"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="角色备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 4}"
            maxlength="50"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <span class="dialog-footer" v-if="currOper !== operation.see">
            <el-button @click="transData.dialogVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="formSubmit('form')" :loading="submitLoading" size="small"
            >{{submitLoading ? '提交中' : '提交'}}</el-button
            >
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState } from 'vuex'
  import { role_prefix } from '@/constants/systemConstants'
  export default {
    name: "AddOrEdit",
    data() {
      return {
        currOper: null,
        form: {
          sort: 100
        },
        rules: {},
        rolePrefix: role_prefix,
        submitLoading: false
      }
    },
    mounted() {
      this.currOper = this.transData.operation
      if (this.transData.operation != this.operation.add) {
        this.form = this.transData.data
      }
    },
    methods: {
      formSubmit(formName) {

      }
    },
    computed: {
      ...mapState(['operation'])
    },
    props: {
      transData: Object
    }
  }
</script>

<style scoped>
  /*dialog最外层样式*/
  /deep/ .el-dialog {
    border-radius: 5px;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 10px 20px 10px 0;
  }
</style>