<template>
  <div class="content">
    <div v-loading="loading">
      <el-collapse  v-model="activeNames">
        <el-collapse-item v-for="item in list" :title="item.name" :key="item.id" :name="item.id">
          <div class="collapse-content">
            <div v-if="item.processTemplateList && item.processTemplateList.length > 0">
              <el-row>
                <el-col v-for="(temp,i) in item.processTemplateList" :key="i" :span="4">
                  <div class="item" @click="apply(temp.id)">
                    <img :src="temp.iconUrl"/>
                    <span>{{temp.name}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <p class="emptyTxt" v-else>暂无数据</p>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div style="margin-top: 10px">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageNo"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :hide-on-single-page="total <= pageSize"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <apply v-if="transData.dialogVisible" :transData="transData"></apply>
  </div>
</template>

<script>
import apply from "./components/apply";
export default {
  name: "index",
  components: {
    apply
  },
  data() {
    return {
      loading: false,
      activeNames: [],
      list: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      transData: {
        dialogVisible: false,
        id: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$api.getRequest('/processType/findTypeAndTemplateList', params).then(res => {
        if(res.success) {
          this.list = res.data.records

          // 展开全部
          this.activeNames = []
          this.list.forEach(i => {
            this.activeNames.push(i.id)
          })
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getData()
    },
    apply(id) {
      this.transData.id = id
      this.transData.dialogVisible = true
    }
  },
}
</script>

<style scoped lang="less">
  .content {
    background: #FFF;
    border-radius: 3px;
    padding: 10px;
    overflow: scroll;
  }

  .collapse-content {
    padding: 10px;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    span {
      font-size: 12px;
      padding: 8px 4px;
      text-align: center;
    }
  }

  .emptyTxt {
    text-align: center;
    color: #A7A8A9;
  }
</style>
