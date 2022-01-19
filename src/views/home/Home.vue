<template>
  <div class="home">
    <router-link to="/system/permission">菜单测试</router-link>
    <br>

    <div>
      <p>当前位置：{{city}}</p>
      <p>天气：{{weatherResult.text}}</p>
      <p>温度：{{weatherResult.temp}}°</p>
      <p>风向：{{weatherResult.windDir}}</p>
      <p>湿度：{{weatherResult.humidity}}</p>
      <p>更新时间：{{weatherResult.updateTime}}</p>
    </div>

  </div>
</template>

<script>
  import { weather_key } from '@/constants/systemConsts'
  // @ is an alias to /src

  export default {
    name: 'Home',
    data() {
      return {
        city:"广州",

        weatherResult: {
          text: '',
          temp: '',
          windDir: '',
          updateTime: '',
          humidity: ''
        }
      }
    },
    mounted() {
      this.getWeatherData()
    },
    methods: {
      getWeatherData() {
        this.searchWeather()
      },
      searchWeather:async function(){
        //在请求的时候需要用async+await让它同步，否则数据不好取出
        let key = 'f92adeb022734c6e89dd464078b63ff4'//引号中放入前面保存的key

        //获取城市的ID
        let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${this.city}&key=${key}`
        let res = await fetch(httpUrl)
        let result = await res.json()
        let id = result.location[0].id
        //根据城市id获取具体的天气
        let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key}`
        let res2 = await fetch(httpUrl1)
        let result2 = await res2.json()
        console.log(result2);
        this.weatherResult.text = result2.now.text
        this.weatherResult.temp = result2.now.temp
        this.weatherResult.windDir = result2.now.windDir
        this.weatherResult.humidity = result2.now.humidity
        this.weatherResult.updateTime = result2.updateTime
      }
    }
  }
</script>

<style scoped>
</style>
