<template>
  <div class="home">
      <!-- 走马灯 -->
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item
            v-for="(item,index) in caroArr"
            :key="index"
            style="border-radius: 10px">
          <el-image style="width: 100%; height: 100%"
                    fit="cover"
                    :src="item">
          </el-image>
        </el-carousel-item>
      </el-carousel>

      <div>
        <!-- 图表统计 -->
        <home-chart></home-chart>
      </div>
  </div>
</template>

<script>
  import HomeChart from "@/components/frame/home/HomeChart"

  import caro1 from '@/assets/images/home/carousel/caro1.jpg'
  import caro2 from '@/assets/images/home/carousel/caro2.jpg'
  import caro3 from '@/assets/images/home/carousel/caro3.jpg'
  import caro4 from '@/assets/images/home/carousel/caro4.jpg'

  // @ is an alias to /src

  export default {
    name: 'Home',
    components: {
      HomeChart
    },
    data() {
      return {
        // 图片数组
        caroArr: [caro1, caro2, caro3, caro4],
        chart: {}
      }
    },

  }
</script>

<style scoped>
  .home {
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
