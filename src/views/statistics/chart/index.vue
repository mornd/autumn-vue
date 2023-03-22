<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="chart-container">
            <div id="chart_list" class="chart" style="height: 350px;width: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="chart-container">
            <div id="chart_list2" class="chart" style="height: 350px;width: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="chart-container">
            <div id="chart_list3" class="chart" style="height: 350px;width: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="chart-container">
            <div id="chart_list4" class="chart" style="height: 350px;width: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "index",
  data() {
    return {
      chart: {},
      chart2: {},
      chart3: {},
      chart4: {},
    }
  },
  mounted() {
    this.showChart()
  },
  methods: {
    showChart: function () {
      let ele = document.getElementById('chart_list')
      let ele2 = document.getElementById('chart_list2')
      let ele3 = document.getElementById('chart_list3')
      let ele4 = document.getElementById('chart_list4')

      this.chart = echarts.init(ele)
      this.chart2 = echarts.init(ele2)
      this.chart3 = echarts.init(ele3)
      this.chart4 = echarts.init(ele4)

      const option = {
        // title: {
        //   text: 'xxx统计'
        // },
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '55%'},
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: {focus: 'series'}
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };

      const option2 = {
        title: {
          text: 'Nightingale Chart',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: [
            'rose1',
            'rose2',
            'rose3',
            'rose4',
            'rose5',
            'rose6',
            'rose7',
            'rose8'
          ]
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        series: [
          {
            name: 'Radius Mode',
            type: 'pie',
            radius: [20, 140],
            center: ['25%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              {value: 40, name: 'rose 1'},
              {value: 33, name: 'rose 2'},
              {value: 28, name: 'rose 3'},
              {value: 22, name: 'rose 4'},
              {value: 20, name: 'rose 5'},
              {value: 15, name: 'rose 6'},
              {value: 12, name: 'rose 7'},
              {value: 10, name: 'rose 8'}
            ]
          },
          {
            name: 'Area Mode',
            type: 'pie',
            radius: [20, 140],
            center: ['75%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              {value: 30, name: 'rose 1'},
              {value: 28, name: 'rose 2'},
              {value: 26, name: 'rose 3'},
              {value: 24, name: 'rose 4'},
              {value: 22, name: 'rose 5'},
              {value: 20, name: 'rose 6'},
              {value: 18, name: 'rose 7'},
              {value: 16, name: 'rose 8'}
            ]
          }
        ]
      };

      const option3 = {
        title: {
          text: 'xxx 折线图'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      };

      const option4 = {
        title: {
          text: 'xxx 柱状图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      };


      option && this.chart.setOption(option)
      option2 && this.chart2.setOption(option2)
      option3 && this.chart3.setOption(option3)
      option4 && this.chart4.setOption(option4)
    }
  }
}
</script>

<style scoped>

</style>
