<template>
  <div>
    <!--对话框-->
    <el-dialog
      top="14vh"
      :visible.sync="transData.dialogVisible"
      :title="transData.title"
      :close-on-click-modal="false"
      width="45%"
    >
      <!--<template slot="title">
        <span style="font-size: 18px;">{{transData.title}}</span>
      </template>-->
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
        :disabled="currOper == operation.see"
        class="from"
        status-icon
        size="small"
      >
        <!--隐藏id项-->
        <el-form-item v-if="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" maxlength="20" clearable placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <!--<el-input v-model="form.code" maxlength="10" clearable placeholder="请输入角色编码">
            <template slot="prepend">{{ rolePrefix }}</template>
          </el-input>-->
          <el-input v-model="form.code" maxlength="30" clearable placeholder='请输入角色编码，系统默认补充"ROLE_"作为前缀'></el-input>
        </el-form-item>
        <el-row :gutter="10" justify="space-between">
          <el-col :span="10">
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
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item v-if="currOper != operation.edit" label="是否启用" prop="enabled">
              <el-tooltip
                :content="'当前：' + (form.enabled == enabledState.enabled ? '启用' : '禁用')"
                placement="top-start"
              >
                <el-radio-group v-model="form.enabled"
                                :fill="form.enabled == enabledState.disabled ? failureColor : ''">
                  <el-radio-button :label="enabledState.enabled">是</el-radio-button>
                  <el-radio-button :label="enabledState.disabled">否</el-radio-button>
                </el-radio-group>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="角色备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            :rows="2"
            :autosize="{ minRows: 4, maxRows: 4}"
            resize="none"
            maxlength="50"
            show-word-limit
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
  import { failure } from '@/constants/colorConst'
  import { isNotBlank } from '@/utils/validate'

  export default {
    name: "AddOrEdit",
    data() {
      const validateName = (rule, value, callback) => {
        if (isNotBlank(value)) {
          this.$api.getRequest(`/role/queryNameExists?id=${this.form.id}&name=${value}`).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error("角色名称已重复"));
              } else {
                callback();
              }
            } else {
              callback(new Error())
            }
          })
        } else {
          callback(new Error("角色名称不能为空"))
        }
      };
      const validateCode = (rule, value, callback) => {
        if (isNotBlank(value)) {
          this.$api.getRequest(`/role/queryCodeExists?id=${this.form.id}&code=${value}`).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error("角色编码已重复"));
              } else {
                callback();
              }
            } else {
              callback(new Error())
            }
          })
        } else {
          callback(new Error("角色编码不能为空"))
        }
      };
      return {
        currOper: null,
        form: {
          //需指定为空字符串，否则表单验证时会出问题
          id: '',
          enabled: undefined,
          sort: 5
        },
        rules: {
          name: [{required: true, validator: validateName, trigger: 'blur'}],
          code: [{required: true, validator: validateCode, trigger: 'blur'}],
          enabled: [{required: true, trigger: 'blur'}],
          sort: [{required: true, trigger: 'blur'}],
        },
        failureColor: failure,
        rolePrefix: role_prefix,
        submitLoading: false
      }
    },
    mounted() {
      this.form.enabled = this.enabledState.enabled
      this.currOper = this.transData.operation
      if (this.transData.operation != this.operation.add) {
        this.form = this.transData.data
      }
    },
    methods: {
      formSubmit(formName) {
        this.submitLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.currOper == this.operation.add) {
              this.$api.postRequest('/role', this.form).then(res => {
                if (res.success) {
                  this.$emit('refreshTable');
                  this.transData.dialogVisible = false;
                }
                this.submitLoading = false;
              })
            } else if (this.currOper == this.operation.edit) {
              this.$api.putRequest('/role', this.form).then(res => {
                if (res.success) {
                  this.$emit('refreshTable')
                  this.transData.dialogVisible = false
                  this.$store.dispatch('setUser').then(res => {
                    this.$store.dispatch('setMenuRoutes')
                  })
                }
                this.submitLoading = false;
              })
            }
          } else {
            this.submitLoading = false;
            return false;
          }
        });
      }
    },
    computed: {
      ...mapState(['operation', 'enabledState'])
    },
    props: {
      transData: Object
    }
  }
</script>

<style lang="less" scoped>
  //form表单高度
  @form-height: 320px;

  .from {
    height: @form-height;
    overflow: auto;
    padding-right: 5px
  }

  /*dialog最外层样式*/
  /deep/ .el-dialog {
    border-radius: 5px;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 20px 20px 5px 20px;
  }

  /*表单样式*/
  .el-form-item {
    margin-bottom: 30px;
  }
</style>