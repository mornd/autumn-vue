<template>
  <div>
    <el-dialog title="发起审批" :visible.sync="transData.dialogVisible">
      <form-create
          :rule="rule"
          :option="option"
          @submit="onSubmit"
      ></form-create>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "apply",
  data() {
    return {
      processTemplate: undefined,
      rule: [],
      option: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api.getRequest(`/processTemplate/get/${this.transData.id}`).then(res => {
        this.processTemplate = res.data
        if(this.processTemplate) {
          this.rule = JSON.parse(this.processTemplate.formProps);
          this.option = JSON.parse(this.processTemplate.formOptions);
        }
      })
    },
    onSubmit(formData) {
      let formShowData = {};
      this.rule.forEach(item => {
        for (let key in formData) {
          if (key === item.field) {
            formShowData[item.title] = formData[key];
          }
        }
      });
      let DATA = {
        formData: formData,
        formShowData: formShowData
      };
      let processFormVo = {
        "processTemplateId": this.processTemplate.id,
        "processTypeId": this.processTemplate.processTypeId,
        "formValues": JSON.stringify(DATA)
      };
      this.$api.postRequest('/process/startup', processFormVo).then(res => {
        if(res.success) {
          this.transData.dialogVisible = false
        }
      })
    }
  },
  props: {
    transData: Object
  }
}
</script>

<style scoped>

</style>
