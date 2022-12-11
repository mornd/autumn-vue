<template>
  <!-- 面包屑效果 -->
  <div class="header_crumbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: $store.state.homePath }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path !== '/home'" v-for="item in levelList" :key="item">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "HeaderBreadCrumb",
    data() {
      return {
        levelList: []
      }
    },
    watch: {
      $route(route) {
        if (route.path.startsWith('/redirect/')) {
          return
        }
        this.getBreadcrumb()
      }
    },
    created() {
      this.getBreadcrumb()
    },
    methods: {
      getBreadcrumb() {
        const menus = this.$store.getters.menuRoutes
        const title = this.$route.name
        this.levelList = []
        // todo 目前只找两层
        for(let i in menus) {
          const parentTitle = menus[i].title
          if(parentTitle === title) {
            this.levelList = [parentTitle]
          } else {
            const child = menus[i].children
            if(child && child instanceof Array && child.length) {
              for (let j in child) {
                const subTitle = child[j].title
                if(subTitle === title) {
                  this.levelList.push(parentTitle)
                  this.levelList.push(subTitle)
                  // return 或 return false 都是结束该方法
                  return false
                }
              }
            }
          }
        }
        // 菜单中未找到
        this.levelList = [title]
      }
    }
  }
</script>

<style scoped>
  /*面包屑*/
  .header_crumbs{
    padding: 8px 20px 8px 20px;
  }
</style>
