<template>
  <div>
    <el-dialog
      top="14vh"
      :visible.sync="grantData.dialogVisible"
      :title="grantData.title"
      :close-on-click-modal="false"
      width="45%"
    >
      <div>
        <el-input
          placeholder="输入关键字进行过滤"
          size="small"
          v-model="filterText">
        </el-input>

          <!--<el-button-group style="margin-top: 10px">
            <el-button type="primary" size="mini">全选</el-button>
            <el-button type="primary" size="mini">清空</el-button>
          </el-button-group>-->

        <div style="height: 310px; margin-top: 10px; overflow: auto">
          <p style="text-align: center; font-size: 20px" v-if="treeLoading">
            <i class="el-icon-loading"></i>
          </p>
          <el-tree
            v-show="!treeLoading"
            check-strictly
            highlight-current
            show-checkbox
            :default-checked-keys="defaultCheckedKeys"
            node-key="id"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            @check="treeCheck"
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
        //默认勾选的节点的 key 的数组
        defaultCheckedKeys: [],
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
                //this.$refs.tree.setCheckedKeys(res) //方式1
                this.defaultCheckedKeys = res //方式2
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
      //节点选中事件，参数1：当前选中节点对象，参数2：树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
      treeCheck(checkNode, checkState) {
        this.checkChildren(checkNode, this.defaultCheckedKeys.includes(checkNode.id))
        this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
      },

      //更新哪些需要勾选的数组 check(boolean) = 是否是选中操作
      checkChildren(node, check) {
        if(check) {
          //如果默认勾选数组中包含该节点，则此时操作为取消选中，移除数组中对应的元素
          this.removeArrItem(node.id)
        } else {
          //如果默认勾选数组中不包含该节点，则此时操作为选中，数组中新增对应的元素
          if(!this.defaultCheckedKeys.includes(node.id)) {
            this.defaultCheckedKeys.push(node.id)
          }
        }
        if(objUtil.arrNotNull(node.children)) {
          for (const item of node.children) {
            this.checkChildren(item, check)
          }
        }
      },

      /**
       * 删除数组中对应id的元素
       * @param id
       */
      removeArrItem(id) {
        for (let i = 0; i < this.defaultCheckedKeys.length; i++) {
          if(this.defaultCheckedKeys[i] == id) {
            this.defaultCheckedKeys.splice(i, 1);
            break;
          }
        }
      },

      //提交数据
      submit() {
         this.submitLoading = true
        //选中节点的keys
        const check = this.$refs.tree.getCheckedKeys()
        console.log(check);
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
    padding: 10px 20px 10px 20px;
  }
</style>