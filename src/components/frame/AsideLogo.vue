<template>
  <!--logo-->
  <div id="logo" :style="{color: theme}">
    <span @click="$router.go()" v-if="!isCollapse">{{ title }}</span>
    <span v-else :title="title"><i :class="logo"/></span>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import systemConst from '@/constants/systemConstants'

  export default {
    name: "AsideLogo",
    data() {
      return {
        logo: systemConst.logo,
        title: systemConst.title
      }
    },
    computed: {
      ...mapState(['isCollapse', 'theme']),
    }
  }
</script>

<style lang="less" scoped>
  #logo {
    border-bottom: 1px solid #101117;
    height: 60px;
    text-align: center;
    font-size: 23px;
    font-weight: bold;
    line-height: 60px;
    span {
      cursor: pointer
    }
  }
</style>