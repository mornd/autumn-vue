<template>
  <div class="home">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 6" :key="item" style="border-radius: 10px">

      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import { weather_key } from '@/constants/systemConsts'

  // @ is an alias to /src

  export default {
    name: 'Home',
    data() {
      return {
      }
    },
    mounted() {

    },
    methods: {
    }
  }
</script>

<style scoped>
  .home {
    padding: 5px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
