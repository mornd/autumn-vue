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
          <el-button-group style="margin-top: 10px">
            <el-button type="primary" size="mini" @click="selectAllTree">全选</el-button>
            <el-button type="primary" size="mini" @click="clearTree">清空</el-button>
          </el-button-group>

        <div style="height: 310px; margin-top: 10px; overflow: auto">
          <p style="text-align: center; font-size: 20px" v-if="treeLoading">
            <i class="el-icon-loading"></i>
          </p>
          <el-tree
            v-show="!treeLoading"
            class="filter-tree"
            default-expand-all
            check-strictly
            highlight-current
            show-checkbox
            node-key="id"
            :data="treeData"
            @check="treeCheck"
            :props="defaultProps"
            :default-checked-keys="checkKeys"
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
  import { arrNotEmpty } from '@/utils/objUtil'
  import { rootMenuId } from '@/constants/systemConsts'

  export default {
    name: "Grant",
    data() {
      return {
        treeLoading: false,
        submitLoading: false,
        filterText: '',
        treeData: [],
        //默认勾选的节点的 key 的数组
        checkKeys: [],
        //所有未排序节点
        allTreeNode: [],
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
            const tree = res.data
            if(arrNotEmpty(tree)) {
              this.setEnabledState(tree)
              //生成菜单树
              this.treeData = tree
              //将tree结构格式为arr结构 用于下文方便比较
              this.treeToArr(tree)
              this.getDefaultCheckKeys().then(res => {
                //回显默认选中的值
                //this.$refs.tree.setCheckedKeys(res) //方式1
                this.checkKeys = res //方式2
                this.treeLoading = false
              })
            }
          }
        })
      },
      //设置禁用值
      setEnabledState(arr) {
        for (let i = 0; i < arr.length; i++) {
          if(arr[i].enabled != this.enabledState.enabled) {
            arr[i].disabled = true
          }
          if(arrNotEmpty(arr[i].children)) {
            this.setEnabledState(arr[i].children)
          }
        }
      },
      //将tree结构转换为Array类型
      treeToArr(list) {
        for (const i of list) {
          this.allTreeNode.push(i)
          if(arrNotEmpty(i.children)) {
            this.treeToArr(i.children)
          }
        }
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
      //树节点搜索过滤功能
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      //节点选中事件，参数1：当前选中节点对象，
      //参数2：树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
      treeCheck(checkNode, checkState) {
        const check = this.checkKeys.includes(checkNode.id)
        //自动勾选父级
        this.checkParent(checkNode, check)
        //自动勾选子集
        this.checkChildren(checkNode, check)
        this.$refs.tree.setCheckedKeys(this.checkKeys)
      },

      //同步选中 | 清除子节点 check(boolean) = 是否是选中操作
      checkChildren(node, check) {
        if(node.enabled == this.enabledState.enabled) { //状态为启用才进行操作
          if(check) {
            //取消选中操作，移除数组中对应的元素
            this.removeArrById(node.id)
          } else {
            //选中操作，数组中新增对应的元素
            if(!this.checkKeys.includes(node.id)) {
              this.checkKeys.push(node.id)
            }
          }
        }
        if(arrNotEmpty(node.children)) {
          node.children.forEach(i => {this.checkChildren(i, check)})
        }
      },
      //选中父节点
      checkParent(node, check) {
        let parentArr = []
        this.findParent(node, parentArr)
        if(!check) {
          parentArr.forEach(i => {
            if(!this.checkKeys.includes(i)) {
              this.checkKeys.push(i)
            }
          })
        }
      },
      //获取节点的所有父级id
      findParent(node, arr) {
        for (let i = 0; i < this.allTreeNode.length; i++) {
          if(node.parentId != rootMenuId
              && node.parentId == this.allTreeNode[i].id) {
            arr.push(node.parentId)
            this.findParent(this.allTreeNode[i], arr)
          }
        }
      },

      /**
       * 删除数组中对应id的元素（根据id删除数据元素）
       * @param id
       */
      removeArrById(id) {
        for (let i = 0; i < this.checkKeys.length; i++) {
          if(this.checkKeys[i] == id) {
            this.checkKeys.splice(i, 1);
            break;
          }
        }
      },
      //提交数据
      submit() {
         this.submitLoading = true
        //选中节点的keys
        const check = this.$refs.tree.getCheckedKeys()
        this.$api.putRequest('/role/bindPersById', {id: this.grantData.data.id, perIds: check}).then(res => {
          if(res.success) {
            this.grantData.dialogVisible = false
            /*this.$store.dispatch('setUser').then(res => {
              this.$store.dispatch('setMenuRoutes')
            })*/
            this.$router.go()
          }
        })
      },

      //全选
      selectAllTree() {
        let disArr = []
        //获取选中并禁用的数据id
        for (const i of this.allTreeNode) {
          for (const j of this.checkKeys) {
            if(i.id == j && i.enabled == this.enabledState.disabled) {
              disArr.push(j)
              break
            }
          }
        }
        this.checkKeys = []
        //获取所有启用的数据
        this.allTreeNode.forEach(i => {
          if(i.enabled == this.enabledState.enabled) { //只勾选所有启用状态的节点
            this.checkKeys.push(i.id)
          }
        })
        //合并启用状态的数组及既是选中状态又是禁用的数组
        disArr.forEach(id => {
          if(!this.checkKeys.includes(id)) {
            this.checkKeys.push(id)
          }
        })
        this.$refs.tree.setCheckedKeys(this.checkKeys)
      },

      //清空所选数据
      clearTree() {
        let disArr = []
        //获取所有禁用数据
        this.allTreeNode.forEach(i => {
          if(i.enabled == this.enabledState.disabled) {
            disArr.push(i.id)
          }
        })
        let retainArr = []
        //获取即使选中状态有是禁用状态的数据
        this.checkKeys.forEach(i => {
          if(disArr.includes(i)) {
              retainArr.push(i)
            }
        })
        this.checkKeys = retainArr
        this.$refs.tree.setCheckedKeys(this.checkKeys)
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