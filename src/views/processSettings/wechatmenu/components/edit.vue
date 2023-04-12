<template>
  <div>
    <el-dialog
        :visible.sync="transData.dialogVisible"
        :title="transData.title"
        :close-on-click-modal="false"
        width="50%"
    >
      <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
          class="from"
          status-icon
          size="small"
      >
        <!--隐藏id项-->
        <el-form-item v-if="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item v-if="parentShow" label="父级">
          <el-input v-model="form.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="200" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select style="width: 100%" v-model="form.type" placeholder="请选择" clearable>
            <el-option
                :key="index"
                v-for="(item,index) in menuType"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="url">
          <el-input v-model="form.url" maxlength="200" clearable placeholder="请输入url"></el-input>
        </el-form-item>
        <el-form-item label="菜单key">
          <el-input v-model="form.menuKey" maxlength="200" clearable placeholder="请输入菜单key"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
      </el-form>

      <span>1.公众号只支持2层级菜单。</span><br>
      <span>2.目录不用填写url和菜单key。</span><br>
      <span>3.自定义菜单最多包括3个一级菜单，每个一级菜单最多包含5个二级菜单。</span><br>
      <span>4.一级菜单最多4个汉字，二级菜单最多8个汉字，多出来的部分将会以“...”代替。</span><br>
      <span>5.类型：view表示网页类型，click表示点击类型，miniprogram表示小程序类型。</span><br>
      <span>6.子菜单必须要选择类型。</span><br>
      <span></span>
      <template slot="footer">
        <span class="dialog-footer">
            <el-button @click="transData.dialogVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="formSubmit()" :loading="submitLoading" size="small"
            >{{submitLoading ? '提交中' : '提交'}}</el-button
            >
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "edit",
  data() {
    return {
      form: {
        id: '',
        name: '',
        parentId: '',
        parentName: '',
        sort: 0
      },
      rules: {
        name: [{required: true, message: '名称不能为空', trigger: ['change', 'blur']}],
        // type: [{required: true, message: '类型不能为空', trigger: ['change', 'blur']}],
        // url: [{required: true, message: 'url不能为空', trigger: ['change', 'blur']}],
        // menuKey: [{required: true, message: '菜单key不能为空', trigger: ['change', 'blur']}],
      },
      menuType: ['view'],
      submitLoading: false,
      apiUrl: '/process/wechatMenu',
      parentId: 0,
      parentShow: false,
    }
  },
  mounted() {
    if(this.transData.operation === 'add') {
      this.form.parentId = this.transData.data.parentId
      this.form.parentName = this.transData.data.parentName
      //  添加
      if (this.form.parentId) {
        this.parentShow = true
      }
    } else {
      // 修改
      this.form = this.transData.data
    }
  },
  methods: {
    formSubmit() {
      this.submitLoading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.form.url && this.form.url.charAt(0) !== '/') {
            // 补上/前缀
            this.form.url = '/' + this.form.url
          }
          let request = undefined
          if (this.transData.operation === 'add') {
            request = this.$api.postRequest(this.apiUrl, this.form)
          } else {
            request = this.$api.putRequest(this.apiUrl, this.form)
          }
          request.then(res => {
            if (res.success) {
              this.$emit('refreshTable')
              this.transData.dialogVisible = false
            }
            this.submitLoading = false
          })
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
