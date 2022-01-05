<template>
  <div>
    <!--对话框-->
    <el-dialog
      top="7vh"
      :visible.sync="transData.dialogVisible"
      :title="transData.title"
      :close-on-click-modal="false"
      width="50%"
    >
      <template slot="title">
        <span style="font-size: 18px;">{{transData.title}}</span>
        <el-popover
          placement="bottom"
          title="小提示"
          :width="400"
          @show="popoverShow"
          trigger="hover"
        >
          <ul class="dialog_popover_ul">
            <!--展示tip的内容-->
            <li v-for="c in tipContent">{{c}}</li>
          </ul>
          <template slot="reference">
            <el-badge :value="badgeFlag ? 'new' : ''" type="danger">
              <i class="fa fa-tag badge-icon"></i>
            </el-badge>
          </template>
        </el-popover>
      </template>
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
        <el-form-item label="菜单类型">
          <el-button-group>
            <el-button @click="menuTypeClick(menuType.catalogue)"
                       :type="form.menuType === menuType.catalogue ? 'primary' : ''"
                       :disabled="currOper != operation.add">
              <i class="fa fa-folder-open-o" style="margin-right: 6px"></i>目录
            </el-button>
            <el-button @click="menuTypeClick(menuType.menu)"
                       :type="form.menuType === menuType.menu ? 'primary' : ''"
                       :disabled="currOper != operation.add">
              <i class="fa fa-list-ul" style="margin-right: 6px"></i>菜单
            </el-button>
            <el-button @click="menuTypeClick(menuType.button)"
                       :type="form.menuType === menuType.button ? 'primary' : ''"
                       :disabled="currOper != operation.add">
              <i class="fa fa-shield" style="margin-right: 6px"></i>权限
            </el-button>
          </el-button-group>
        </el-form-item>
        <div class="form-container">
          <el-form-item label="父级菜单" prop="parent">
            <el-select
              v-model="form.parentId"
              @visible-change="parentMenuSelectVisible"
              ref="parentMenuSelect"
              placeholder="请选择父级菜单"
              :disabled="form.enabled === enabledState.disabled && currOper !== operation.add"
              v-if="!menuSelectLoading"
              style="width: 100%"
              clearable>
              <el-option
                v-for="item in parentSelectList"
                :key="1"
                :label="item.title"
                :value="item.id">
              </el-option>
              <template slot="empty">
                <div class="tree-wrap">
                  <el-input v-model="parentMenuFilterText" placeholder="输入名称进行搜索" v-if="parentTreeList.length"
                            style="padding-bottom: 5px" clearable></el-input>
                  <!--树形菜单-->
                  <div class="tree-content">
                    <el-tree
                      :data="parentTreeList"
                      ref="parentMenuTree"
                      :filter-node-method="filterParentMenuNode"
                      node-key="id"
                      default-expand-all
                      :props="defaultProps">
                      <!--tree的每一项-->
                      <template #default="{ node, data }">
                        <div
                          :title="data.id === form.parentId ? '已选' : (data.enabled !== enabledState.enabled ? '禁用' : '可用')"
                          class="parent-picker-item">
                          <!--左边显示文字-->
                          <span v-if="data.enabled === enabledState.enabled">
                                <!--已选和可用样式-->
                                <span :style="{color: (data.id === form.parentId ? primaryColor : successColor)}">{{ data.title }}</span>
                              </span>
                          <!--禁用-->
                          <span v-else :style="{color: failureColor}">{{ data.title }}</span>

                          <!--右边选择按钮-->
                          <span class="parent-picker-item-icon">
                            <span v-if="data.enabled === enabledState.enabled && data.id !== form.parentId"
                                  @click.stop="parentNodeClick(data)" title="选择">
                              <i class="fa fa-hand-pointer-o" :style="{color: successColor}"></i>
                            </span>
                            <span v-else-if="data.id !== form.parentId" @click.stop>
                              <i class="fa fa-ban" :style="{color: failureColor}"></i>
                            </span>
                            <span v-else-if="data.id === form.parentId" @click.stop>
                              <i class="fa fa-hand-peace-o" :style="{color: primaryColor}"></i>
                            </span>
                          </span>
                        </div>
                      </template>
                    </el-tree>
                  </div>
                </div>
              </template>
            </el-select>
            <i v-else class="el-icon-loading"></i>
          </el-form-item>
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model.trim="form.title" maxlength="20" clearable placeholder="请输入菜单标题"></el-input>
          </el-form-item>
          <transition name="fade">
            <el-form-item label="菜单编码" prop="code">
              <el-input v-model.trim="form.code" maxlength="20" clearable placeholder="请输入菜单编码"></el-input>
            </el-form-item>
          </transition>
          <transition name="fade">
            <el-form-item label="菜单路径" v-if="form.menuType == menuType.menu" prop="path">
              <el-input v-model.trim="form.path" maxlength="30" clearable placeholder="请输入菜单路径(前缀可不加'/')"></el-input>
            </el-form-item>
          </transition>
          <transition name="fade">
            <el-form-item label="菜单组件" v-if="form.menuType == menuType.menu" prop="component">
              <el-input v-model.trim="form.component" maxlength="30" clearable
                        placeholder="请输入菜单组件(前缀可不加'/')"></el-input>
            </el-form-item>
          </transition>
          <el-form-item label="图标" v-if="form.menuType != menuType.button" prop="icon">
            <!--第三方图标选择器组件-->
            <e-icon-picker
              v-model="form.icon"
              :disabled="currOper == operation.see"
              :zIndex="5000"
              placement="top"
              :defaultIcon="defaultIcon"
              :options="eIconOptions"
              size="small"
            />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="排序" prop="sort">
                <el-tooltip
                  :content="currOper === operation.see ? ('当前：' + form.sort.toFixed(2)) : '升序展示'"
                  placement="top"
                >
                  <el-input-number
                    v-model="form.sort"
                    :min="1"
                    :step="1"
                    :max="500"
                    :precision="2"
                    style="width: 100%"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <!--<el-col :span="6">
              &lt;!&ndash;解决el-col如果元素没有内容就会被合并&ndash;&gt;
              <div style="min-height: 1px"></div>
            </el-col>-->
          </el-row>
          <el-row :gutter="20" justify="space-between">
            <el-col :span="8">
              <el-form-item v-if="currOper === operation.add || currOper == operation.see" label="是否启用" prop="enabled">
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
            <el-col :span="8">
              <el-form-item label="菜单可见" prop="hidden">
                <el-tooltip
                  :content="'当前：' + (form.hidden == hiddenFlag.display ? '是' : '否')"
                  placement="top-start"
                >
                  <el-radio-group v-model="form.hidden"
                                  @change="hiddenChange"
                                  :fill="form.hidden != hiddenFlag.display ? failureColor : ''">
                    <el-radio-button :label="hiddenFlag.display">是</el-radio-button>
                    <el-radio-button :label="hiddenFlag.hidden">否</el-radio-button>
                  </el-radio-group>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <transition name="fade">
                <el-form-item label="菜单缓存" v-if="form.menuType == menuType.menu" prop="keepAlive">
                  <el-tooltip
                    :content="'当前：' + (form.keepAlive == 1 ? '是' : '否')"
                    placement="top-start"
                  >
                    <el-radio-group v-model="form.keepAlive" :fill="form.keepAlive != 1 ? failureColor : ''">
                      <el-radio-button :label="1">是</el-radio-button>
                      <el-radio-button :label="0">否</el-radio-button>
                    </el-radio-group>
                  </el-tooltip>
                </el-form-item>
              </transition>
            </el-col>
          </el-row>
        </div>
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
  import {mapState} from 'vuex'
  import {EIconPicker} from 'e-icon-picker';
  import { rootMenuId } from '@/constants/systemConstants'
  import { primary, success, failure } from '@/constants/colorConst'

  export default {
    name: "AddOrEdit",
    components: {EIconPicker},
    data() {
      //自定义校验规则
      const validateParent = (rule, value, rollback) => {
        if (this.form.parentId || this.form.parentId == rootMenuId) {
          rollback();
        } else {
          rollback('父级菜单不能为空');
        }
      };
      const validateTitle = (rule, value, callback) => {
        if (value) {
          this.$api.getRequest(`/permission/queryTitleRepeated?title=${value}&id=${this.form.id ? this.form.id : ''}`).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error("标题已重复"));
              } else {
                callback();
              }
            } else {
              callback(new Error())
            }
          })
        } else {
          callback(new Error("标题不能为空"))
        }
      };
      const validateCode = (rule, value, callback) => {
        if (value) {
          this.$api.getRequest(`/permission/queryCodeRepeated?code=${value}&id=${this.form.id ? this.form.id : ''}`).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error("编码已重复"));
              } else {
                callback();
              }
            } else {
              callback(new Error())
            }
          })
        } else {
          callback(new Error("编码不能为空"))
        }
      };
      return {
        //操作该组件的类型
        currOper: undefined,
        //表单对象
        form: {
          parentId: '',
          menuType: undefined,
          icon: this.logo,
          sort: 5,
          enabled: undefined,
          keepAlive: 1,
          hidden: undefined
        },
        //表单校验规则
        rules: {
          parent: [{required: true, validator: validateParent, trigger: 'change'}],
          title: [{required: true, validator: validateTitle, trigger: 'blur'}],
          code: [{required: true, validator: validateCode, trigger: 'blur'}],
          path: [{required: true, message: '路径不能为空', trigger: ['change', 'blur']}],
          component: [{required: true, message: '组件不能为空', trigger: ['change', 'blur']}],
          icon: [{required: true, message: '图标不能为空', trigger: ['change', 'blur']}],
          sort: [{required: true, message: '排序不能为空', trigger: ['change', 'blur']}],
          enabled: [{required: true, message: '启用状态不能为空', trigger: ['change', 'blur']}],
          hidden: [{required: true, message: '显隐状态不能为空', trigger: ['change', 'blur']}],
          keepAlive: [{required: true, message: '菜单缓存不能为空', trigger: ['change', 'blur']}],
        },
        parentMenuFilterText: '',
        //选择父节点选择器的数据
        parentSelectList: [],
        //选择父节点树的数据
        parentTreeList: [],
        //目录集合
        parentCatalogues: [],
        //目录和菜单集合
        parentCatalogueAndMenu: [],
        //tree组件所需的配置
        defaultProps: {
          children: 'children',
          label: 'title',
        },
        //加载按钮
        submitLoading: false,
        //父级菜单选择器加载flag
        menuSelectLoading: true,
        //eIcon配置
        defaultIcon: this.logo,
        eIconOptions: {
          FontAwesome: true,
          ElementUI: true,
          eIcon: false,//自带的图标，来自阿里妈妈
          eIconSymbol: false,//是否开启彩色图标
        },
        //统一颜色
        successColor: success,
        failureColor: failure,
        primaryColor: primary,
        tipContent: [
          '添加规则：目录/菜单的父级必须是目录，权限的父级可以是目录/菜单，但不能是权限',
          '目录：代表直接插入根节点的父节点(与主页菜单平级)',
          '菜单：可以点击跳转页面的节点',
          '权限(按钮)：访问的权限标识',
          '菜单编码：唯一值，用户根据编码获取对应的菜单信息',
          "菜单路由：前端路由对象的path属性(前缀可不加' / ')",
          "菜单组件：前端路由对象的component属性(前缀可不加' / ')",
          '排序：值越小，菜单显示越靠前(最小值为1)',
          '是否启用：默认只能启用(禁用)没有子集的目录，菜单、权限则不受限制',
          '菜单可见：如果状态为否，则所有页面隐藏该节点，且不参与权限相关的操作',
          '路由菜单：点击是否可跳转页面',
          '菜单缓存：keep_alive值',
          '目前主页左侧只能显示的菜单层级为两级',
        ]
      }
    },
    computed: {
      ...mapState(['title', 'logo', 'menuType', 'enabledState', 'operation', 'hiddenFlag', 'badgeFlag'])
    },
    created() {
      //表单赋默认值
      this.form.menuType = this.menuType.menu;
      this.form.enabled = this.enabledState.enabled;
      this.form.hidden = this.hiddenFlag.display;
    },
    mounted() {
      this.currOper = this.transData.operation
      if (this.transData.operation != this.operation.add) {
        this.form = this.transData.data
      }
      this.getParentTreeData()
    },
    methods: {
      //查询父级菜单信息
      getParentTreeData() {
        let url = ''
        if(this.form.menuType === this.menuType.button) {
          if(this.parentCatalogueAndMenu.length) {
            this.parentTreeList = this.parentCatalogueAndMenu
            return
          }
          url = '/permission/findCatalogueAndMenu'
        } else {
          if(this.parentCatalogues.length) {
            this.parentTreeList = this.parentCatalogues
            return
          }
          //获取所有目录
          url = '/permission/findCatalogues'
        }
        this.menuSelectLoading = true
        this.$api.getRequest(url).then(res => {
          if (res.success) {
            this.handleParentList(res.data)
            this.menuSelectLoading = false
          }
        })
      },
      //处理父级查询的结果
      handleParentList(arr) {
        this.parentTreeList = [{
          id: rootMenuId,
          title: this.title,
          enabled: this.enabledState.enabled,
          children: arr
        }]
        if (this.currOper !== this.operation.add) {
          //回显父级的title
          this.findTitleByParentId(this.form.parentId, this.parentTreeList);
        }
        if(this.form.menuType === this.menuType.button) {
          this.parentCatalogueAndMenu = this.parentTreeList
        } else {
          this.parentCatalogues = this.parentTreeList
        }
      },

      //在编辑状态下，根据parentId遍历所有数据找到其对应的title信息
      findTitleByParentId(parentId, list) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (parentId === item.id) {
            this.parentSelectList = [{id: parentId, title: item.title}]
            break
          }
          if (Array.isArray(item.children) && item.children.length && !this.parentSelectList.length) {
            this.findTitleByParentId(parentId, item.children)
          }
        }
      },
      //菜单类型按钮点击
      menuTypeClick(type) {
        this.form.menuType = type
        if(this.currOper === this.operation.add) {
          //重置父级
          this.form.parentId = ''
          this.parentSelectList = []
        }
        this.getParentTreeData()
      },

      //父菜单选择器操作
      filterParentMenuNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      //选择tree的某一项节点
      parentNodeClick(data) {
        this.$refs.parentMenuSelect.blur()
        this.parentSelectList = [{id: data.id, title: data.title}]
        this.form.parentId = data.id
      },
      //选择父级的选择器获取焦点时触发
      parentMenuSelectVisible(flag) {
        //true：打开 false：关闭
        if (flag) {
          //清空真正的值，展示虚拟菜单树
          this.parentSelectList = []
        }
      },
      /*表单操作*/
      //表单提交
      formSubmit(formName) {
        this.submitLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //表单对象
            let tempForm = {};
            switch (this.form.menuType) {
              case this.menuType.catalogue:
                tempForm = {
                  'id': this.form.id,
                  'parentId': this.form.parentId,
                  'title': this.form.title,
                  'icon': this.form.icon,
                  'code': this.form.code,
                  'enabled': this.form.enabled,
                  'sort': this.form.sort,
                  'hidden': this.form.hidden,
                  'menuType': this.form.menuType
                };
                break;
              case this.menuType.menu:
                Object.assign(tempForm, this.form)
                break;
              case this.menuType.button:
                tempForm = {
                  'id': this.form.id,
                  'parentId': this.form.parentId,
                  'title': this.form.title,
                  'code': this.form.code,
                  'enabled': this.form.enabled,
                  'sort': this.form.sort,
                  'hidden': this.form.hidden,
                  'menuType': this.form.menuType
                };
                break;
            }
            if (this.currOper == this.operation.add) {
              this.$api.postRequest('/permission', {...tempForm}).then(res => {
                if (res.success) {
                  this.$emit('refreshTable');
                  this.transData.dialogVisible = false;
                }
                this.submitLoading = false;
              })
            } else if (this.currOper == this.operation.edit) {
              this.$api.putRequest('/permission', {...tempForm}).then(res => {
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
      },

      /*其他操作*/
      hiddenChange(val) {
        if (this.currOper == this.operation.edit && this.form.menuType != this.menuType.button) {
          if (this.hiddenFlag.display == val) {
            this.$confirm(`是否显示该节点？`, '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            }).catch(() => {
              this.form.hidden = this.hiddenFlag.hidden
            })
          } else {
            this.$confirm(`是否隐藏该节点及该节点的所有子节点？`, '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            }).catch(() => {
              this.form.hidden = this.hiddenFlag.display
            })
          }
        }
      },
      //徽章操作
      popoverShow() {
        this.$store.commit('SET_BADGEFLAG', false)
      },
    },
    props: {
      transData: {
        type: Object,
        default: () => {
        },
        require: true,
      }
    },
    watch: {
      //监听父级菜单选择时搜索区域的内容
      parentMenuFilterText(val) {
        this.$refs.parentMenuTree.filter(val)
      }
    }
  }
</script>

<style lang="less" scoped>
  //导入eIconPicker图标样式
  @import '~e-icon-picker/lib/index.css';
  @import '~font-awesome/css/font-awesome.min.css';
  @import '~element-ui/lib/theme-chalk/icon.css';

  //树节点每一项的高度
  @tree-item-height: 35px;
  /*tip图标*/
  .badge-icon {
    color: #CCC;
    margin-left: 20px;
    cursor: pointer;
    font-size: 18px
  }

  /*::-webkit-scrollbar{
    display:none;
  }*/

  /*表单主体*/
  .form-container {
    height: 420px;
    overflow: auto;
    padding-right: 10px;
  }

  //选择父级的tree组件
  .tree-wrap {
    max-height: 350px;
    padding: 10px;
    border-radius: 5px;
  }

  //包裹tree所有项的元素
  .tree-content {
    max-height: 310px;
    border-radius: 5px;
    overflow: auto;
  }


  /*父级菜单树形选择器的每一项样式*/
  .parent-picker-item {
    line-height: @tree-item-height;
    font-size: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  /*右侧图标样式*/
  .parent-picker-item-icon {
    margin-right: 15px;
    font-size: 16px
  }


  /*
    修改插件的样式
  */
  /*dialog最外层样式*/
  /deep/ .el-dialog {
    /*dialog高度*/
    /*height: 100%;*/
    border-radius: 5px;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 10px 5px 5px 0;
  }

  /*表单样式*/
  .el-form-item {
    margin-bottom: 20px;
  }

  //最后一个元素
  .el-row:last-child {
    margin-bottom: 0;
  }

  /*树节点样式*/
  /deep/ .el-tree-node__content {
    height: @tree-item-height;
  }

  /*菜单提示的popover*/
  .dialog_popover_ul li {
    margin-bottom: 5px;
  }

  /*组件过渡样式*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
