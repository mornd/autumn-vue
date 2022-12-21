<template>
  <!--logo-->
  <div id="logo" :style="{color: theme}">
    <span @click="$router.go()" v-if="!isCollapse">{{ title }}</span>
    <span v-else :title="title"><i :class="logo"></i></span>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "AsideLogo",
    computed: {
      ...mapState(['title', 'logo', 'isCollapse', 'theme']),
    }
  }
</script>

<style lang="less" scoped>
  // 高度
  @logo-height: 59px;

  #logo {
    width: 100%;
    border-bottom: 1px solid #101117;
    height: @logo-height;
    text-align: center;
    font-size: 23px;
    font-weight: bold;
    line-height: @logo-height;
    span {
      cursor: pointer
    }
  }
</style>
