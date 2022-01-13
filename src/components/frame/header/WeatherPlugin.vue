<template>
  <!--天气插件-->
  <div id="he-plugin-standard"></div>
</template>

<script>
  import { weather_key } from '@/constants/systemConstants'

  export default {
    name: "WeatherPlugin",
    created() {
      this.init()
    },
    methods: {
      //请求天气api
      init() {
        console.log('正在获取天气插件数据...');
        window.WIDGET = {
          "CONFIG": {
            "layout": "1",
            "width": this.width,
            "height": this.height,
            "background": "1",
            "dataColor": "FFFFFF",
            "borderRadius": "5",
            "key": weather_key
          }
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0';
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    },
    props: {
      width: Number,
      height: Number
    }
  }
</script>