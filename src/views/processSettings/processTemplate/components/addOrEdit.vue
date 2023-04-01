<template>
  <div>
    <!--对话框-->
    <el-dialog
        top="20vh"
        :visible.sync="transData.dialogVisible"
        :title="transData.title"
        :close-on-click-modal="false"
        :fullscreen="step === 1"
        width="50%"
    >
      <el-steps :active="step" finish-status="success" simple size="mini" style="margin-bottom: 20px">
        <el-step title="基本设置" icon="el-icon-edit"></el-step>
        <el-step title="表单设置" icon="el-icon-document"></el-step>
        <el-step title="流程设置" icon="el-icon-upload"></el-step>
      </el-steps>

      <el-form
          v-show="step === 0"
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
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" style="width: 50%" maxlength="200" clearable placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="审批类型" prop="processTypeId">
          <el-select
              style="width: 50%"
              v-model="form.processTypeId"
              filterable
              clearable>
            <el-option
                v-for="item in processTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="iconUrl">
          <el-select
              style="width: 50%"
              v-model="form.iconUrl"
              filterable
              clearable>
            <el-option
                v-for="item in 1"
                :key="item"
                :value="item"
                :label="item">
            </el-option>
          </el-select>
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
      <div v-show="step === 1">
        <!-- 动态表单 -->
        <fc-designer class="form-build" ref="designer"/>
      </div>
      <div v-show="step === 2">

        <!-- 上传文件的组件，这里定制为手动调用自定义方法上传，并且只能上传1份zip文件 -->
        <el-upload
            drag
            ref="upload"
            action="none"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            accept=".zip"
            :before-upload="beforeUpload"
            :on-preview="onFilePreview"
            :on-progress="onFileProgress"
            :on-change="onFileChange"
            :on-remove="onFileRemove"
            :on-exceed="onFileExceed"
            >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将流程文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传一份zip文件，并且你的文件名就是流程定义的key，大小不超过5mb</div>
        </el-upload>
      </div>
      <template slot="footer">
        <span class="dialog-footer">
            <el-button @click="transData.dialogVisible = false" size="small">取消</el-button>
            <el-button v-if="step === 1" @click="getDesignerData" type="primary" size="small">查看表单数据</el-button>
            <el-button v-if="step === 2" @click="showFileList" type="primary" size="small">查看文件数据</el-button>
            <el-button v-if="step !== 0" type="primary" @click="prev()" size="small">上一步</el-button>
            <el-button v-if="step !== 2" type="primary" @click="next()" size="small">下一步</el-button>
            <el-button v-if="step === 2" type="primary" @click="formSubmit()" :loading="submitLoading" size="small"
            >{{submitLoading ? '提交中' : '提交'}}</el-button
            >
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { isNotBlank } from '@/utils/validate'
import {downloadProcessFile} from "@/utils/processUtil";

export default {
  name: "addOrEdit",
  data() {
    const validateName = (rule, value, callback) => {
      if (isNotBlank(value)) {
        this.$api.getRequest(`/processTemplate/checkName?id=${this.form.id}&name=${value}`).then(res => {
          if (res.success) {
            if (res.data) {
              callback(new Error("模板名称已重复"));
            } else {
              callback()
            }
          } else {
            callback(new Error())
          }
        })
      } else {
        callback(new Error("模板名称不能为空"))
      }
    };
    return {
      form: {
        id: '',
        name: '',
        processTypeId: '',
        iconUrl: '',
        formProps: '',
        formOptions: '',
        description: '',
      },
      rules: {
        name: [{required: true, validator: validateName, trigger: 'blur'}],
        processTypeId: [{required: true, message: '模板类型不能为空', trigger: ['change']}]
      },
      processTypeList: [],
      baseUrl: '/processTemplate',
      step: 0,
      fileList: (this.transData.operation === 'add')
          ? [] : [{name: this.transData.data.processDefinitionFileName, url: '',custom: 'original'}],
      submitLoading: false
    }
  },
  mounted() {
    this.getProcessTypeList()
    if(this.transData.operation !== 'add') {
      this.form = this.transData.data
      this.$nextTick(() => {
        // 回显动态表单数据
        this.$refs.designer.setRule(this.transData.rule)
        this.$refs.designer.setOption(this.transData.option)
      })
    }

  },
  methods: {
    // 获取审批类型列表
    getProcessTypeList() {
      this.$api.getRequest('/processType/getAllTypeNames').then(res => {
        if(res.success) {
          this.processTypeList = res.data
        }
      })
    },
    prev() {
      this.step--
    },
    next() {
      if(this.step === 0) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.step++
          }
        })
      } else {
        this.step++
      }
    },
    getDesignerData() {
      this.$message.info('rule:' + JSON.stringify(this.$refs.designer.getRule())
          + ', options:' + JSON.stringify(this.$refs.designer.getOption()))
    },
    // 文件列表变化时触发
    onFileChange(file, fileList) {
      const size = file.size / 1024 / 1024
      console.log('文件大小：',size.toFixed(5) + 'mb');
      const isLt5M = size < 5
      if(!isLt5M) {
        // 清空文件列表，否则给出提示但是文件列表还是有数据。
        this.$refs.upload.clearFiles()
        this.$message.error('上传文件大小不能超过5mb')
        return false
      }
      // 这里将upload组件的fileList和本地变量关联起来
      this.fileList = fileList
    },

    // 上传的文件大于 limit 中的数量时触发
    onFileExceed(file, fileList) {
      this.$message.error('默认只能上传一份文件，若想替换请先删除之前的文件')
    },

    // 文件列表移除文件时的钩子
    onFileRemove(file, fileList) {
      //fileList.lenth =  删除后的文件列表长度
      this.fileList = []
    },

    // 点击文件列表中已上传的文件时的钩子
    onFilePreview(file) {
      if(file.status === 'success' && file.custom) {
        this.$confirm(`是否下载该流程定义文件到本地?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 下载文件
          downloadProcessFile(`/processTemplate/downloadProcessDefinition/${this.transData.data.processDefinitionFileName}`,
              this.transData.data.processDefinitionFileName)
        })
      }
      console.log(JSON.stringify(file));
    },
    showFileList() {
      this.$message.info(this.fileList)
    },
    // 此处不触发
    beforeUpload(file) {
      alert('beforeUpload')
    },
    // 此处不触发
    onFileProgress(file) {
      alert('onFileProgress')
    },
    //  提交
    formSubmit() {
      if(this.fileList.length === 0) {
        this.$message.error('请先选择要上传的文件')
      } else {
        this.submitLoading = true
        const file = this.fileList[0]
        // 用作修改时触发，true：流程文件已被改动过了，需要替换掉，false：表示流程文件没有改动，无需替换文件。
        if(file.status === 'success' && file.custom) {
          this.form.updateFile = false
        } else {
          this.form.updateFile = true
        }
        // 获取动态表单数据
        this.form.formProps = JSON.stringify(this.$refs.designer.getRule())
        this.form.formOptions = JSON.stringify(this.$refs.designer.getOption())

        let formData = new FormData()
        formData.append("file", file.raw)
        // 将 form 表单数据填充到 formData 对象中
        for(let key in this.form) {
          formData.append(key, this.form[key])
        }
        //Object.keys(this.form).forEach(key => {}) // 方式二

        // "Content-Type": "multipart/form-data;charset=utf-8"

        let request = undefined
        if(this.transData.operation === 'add') {
          request = this.$api.postRequest(
              `${this.baseUrl}/insertAndUploadProcessDefinition`, formData);
        } else if(this.transData.operation === 'edit') {
          request = this.$api.putRequest(
              `${this.baseUrl}/updateAndUploadProcessDefinition`, formData)
        }

        request.then(res => {
          if(res.success) {
            this.$emit('refreshTable')
            this.transData.dialogVisible = false
          }
          this.submitLoading = false
        })
      }
    }
  },
  props: {
    transData: Object
  }
}
</script>

<style scoped>
/deep/ .el-dialog__body {
  padding-top: 5px;
}
</style>