<template>
  <!--颜色选择器-->
  <div class="color-block">
    <div v-for="item in checkColorList"
         :key="item.color"
         :style="{backgroundColor: item.color}"
         @click="colorBlockClick(item)"
         :class="item.check ? 'check' : ''"
    >
      <i v-if="item.check" :style="iconColor" class="fa fa-paint-brush"></i>
    </div>
    <el-color-picker
      v-model="theme"
      @change="colorChange"
      :predefine="predefineColors"
      class="color-picker"
    >
    </el-color-picker>
  </div>
</template>

<script>
  import { defaultTheme } from '@/utils/themeUtil'

  export default {
    name: "ColorPicker",
    data() {
      return {
        //预定义主题
        predefineColors: [
          '#00ced1',
          '#009f95',
          '#f56c6c',
          '#36B368',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          'hsl(181, 100%, 37%)',
          '#1e90ff',
          '#c71585',
          'rgb(255, 120, 0)',
          '#3963BC',
          '#FF5C93',

          //备用
          //'#5FB878',
          //'hsv(51, 100, 98)',
          //'rgba(255, 69, 0, 0.68)',
          //'hsva(120, 40, 94, 0.5)',
          //'hsla(209, 100%, 56%, 0.73)',
          //'#c7158577',
        ],
        //记住选择的颜色
        checkColorList: []
      }
    },
    mounted() {
      //浏览器缓存读取
      const seriaList = sessionStorage.getItem('selectThemeList');
      if(seriaList) {
        this.checkColorList = JSON.parse(seriaList)
      } else {
        let count = 4; //展示色块的个数
        for (let i = 0; i < this.predefineColors.length && i < count; i++) {
          this.checkColorList.push({color: this.predefineColors[i], check: false})
        }
      }
      this.checked(this.theme)
    },
    methods: {
      colorChange(color) {
        let submitColor = ''
        let arr = this.checkColorList
        if(color) {
          let flag = {exist: false}
          for (let i = 0; i < arr.length; i++) {
            if(this.equalsIgnoreCase(arr[i].color, color)) {
              flag = {exist: true, index: i}
              break;
            }
          }
          if(flag.exist) {
            arr.splice(flag.index, 1)
          } else {
            arr.pop()
          }
          arr.unshift({color, check: true})
          submitColor = color
        } else {
          submitColor = defaultTheme
        }
        this.$store.commit('SET_THEME', submitColor)
        this.checked(submitColor)
        sessionStorage.setItem('selectThemeList', JSON.stringify(arr))
      },
      //色块点击事件
      colorBlockClick(c) {
        this.checked(c.color)
        this.$store.commit('SET_THEME', c.color)
      },
      //忽略大小写比较
      equalsIgnoreCase(v1, v2) {
        return v1.toUpperCase() === v2.toUpperCase()
      },
      //选中
      checked(color) {
        this.checkColorList.forEach(i => {
          i.check = this.equalsIgnoreCase(i.color, color)
        })
      }
    },
    computed: {
      theme: {
        get() {
          return this.$store.state.theme
        },
        set(value) {}
      },
      iconColor() {
        if(this.theme.toUpperCase() === '#FFF'
            || this.theme.toUpperCase() === '#FFFFFF') {
          return {color: '#000'}
        } else {
          return {color: '#FFF'}
        }
      }
      //...mapState(['theme'])
    },
  }
</script>

<style lang="less" scoped>
  //色块高
  @colorBlockHeight: 30px;

  .color-block {
    display: flex;
    justify-content: space-around;
    div:not(.color-picker) {
      text-align: center;
      line-height: @colorBlockHeight;
      width: 30px;
      height: @colorBlockHeight;
      border-radius: 5px;
      i {
        font-size: 5px;
      }
    }
  }
  .check {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .color-picker {
    position: relative;
    top: -5px;
    left: -5px;
  }
</style>