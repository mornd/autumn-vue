<template>
  <div>
    <el-dialog
      top="10vh"
      :visible.sync="grantData.dialogVisible"
      :title="grantData.title"
      :close-on-click-modal="false"
      width="50%"
    >
      <div>
        <el-input
          placeholder="输入关键字进行过滤"
          size="small"
          v-model="filterText">
        </el-input>

        <div style="height: 300px; margin-top: 10px; overflow: auto">
          <p style="text-align: center; font-size: 20px" v-if="treeLoading">
            <i class="el-icon-loading"></i>
          </p>
          <el-tree
            v-show="!treeLoading"
            highlight-current
            show-checkbox
            node-key="id"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </div>
      </div>
      <template slot="footer">
        <span class="dialog-footer">
            <el-button @click="grantData.dialogVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="submit()" :loading="submitLoading" size="small"
            >{{submitLoading ? '提交中' : '提交'}}</el-button
            >
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import objUtil from '@/utils/objUtil'

  export default {
    name: "Grant",
    data() {
      return {
        treeLoading: false,
        submitLoading: false,
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    mounted() {
      this.getTree()
    },
    methods: {
      //加载tree数据
      getTree() {
        this.treeLoading = true
        this.$api.getRequest('/role/getAllPers').then(res => {
          if(res.success) {
            if(objUtil.arrNotNull(res.data)) {
              this.formatData(res.data)
              this.treeData = res.data
              this.getDefaultCheckKeys().then(res => {
                //回显默认选中的值
                this.$refs.tree.setCheckedKeys(res)
                this.treeLoading = false
              })
            }
          }
        })
      },
      //获取默认选中的keys
      getDefaultCheckKeys() {
        return new Promise(resolve => {
          this.$api.getRequest(`/role/getPersById/${this.grantData.data.id}`).then(res => {
            if(res.success) {
              resolve(res.data)
            }
          })
        })
      },
      //设置禁用值
      formatData(arr) {
        for (let i = 0; i < arr.length; i++) {
          if(arr[i].enabled != this.enabledState.enabled) {
            arr[i].disabled = true
          }
          if(objUtil.arrNotNull(arr[i].children)) {
            this.formatData(arr[i].children)
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      //提交数据
      submit() {
         this.submitLoading = true
        //选中节点的keys
        const check = this.$refs.tree.getCheckedKeys()
        this.$api.putRequest('/role/bindPersById', {id: this.grantData.data.id, perIds: check}).then(res => {
          if(res.success) {
            this.grantData.dialogVisible = false
            this.$store.dispatch('setUser').then(res => {
              this.$store.dispatch('setMenuRoutes')
            })
          }
        })
      }
    },
    computed: {
      ...mapState(['enabledState'])
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    props: {
      grantData: Object
    },
  }
</script>

<style scoped>
  /*dialog最外层样式*/
  /deep/ .el-dialog {
    border-radius: 5px;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 20px 20px 5px 20px;
  }
</style>