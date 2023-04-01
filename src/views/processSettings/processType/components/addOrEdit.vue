<template>
  <div>
    <!--对话框-->
    <el-dialog
        top="22vh"
        :visible.sync="transData.dialogVisible"
        :title="transData.title"
        :close-on-click-modal="false"
        width="35%"
    >
      <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="60px"
          class="from"
          status-icon
          size="small"
      >
        <!--隐藏id项-->
        <el-form-item v-if="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="200" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
              type="textarea"
              v-model="form.description"
              :rows="2"
              :autosize="{ minRows: 4, maxRows: 4}"
              resize="none"
              maxlength="500"
              show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <span class="dialog-footer">
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
export default {
  name: "addOrEdit",
  data() {
   return {
     form: {
       id: '',
       name: '',
       description: ''
     },
     rules: {
       name: [{required: true, message: '名称不能为空', trigger: ['change', 'blur']}]
     },
     submitLoading: false,
   }
  },
  mounted() {
    if(this.transData.operation !== 'add') {
      this.form = this.transData.data
    }
  },
  methods: {
    formSubmit(formName) {
      this.submitLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.transData.operation === 'add') {
            this.$api.postRequest('/processType', this.form).then(res => {
              if (res.success) {
                this.$emit('refreshTable')
                this.transData.dialogVisible = false
              }
              this.submitLoading = false
            })
          } else {
            this.$api.putRequest('/processType', this.form).then(res => {
              if (res.success) {
                this.$emit('refreshTable')
                this.transData.dialogVisible = false
              }
              this.submitLoading = false
            })
          }
        } else {
          this.submitLoading = false
          return false
        }
      });
    }
  },
  props: {
    transData: Object
  }
}
</script>

<style scoped>

</style>
