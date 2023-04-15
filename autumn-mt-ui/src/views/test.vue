<template>
  <div>
    <div>账号切换</div>
    <el-button type="danger" @click="clear()">清空本地token</el-button>
    <br>
    <br>
    <el-button type="primary" @click="func1()">tom</el-button>
    <el-button type="primary" @click="func2()">alice</el-button>
    <el-button type="primary" @click="func3()">bob</el-button>
    <div>当前token：{{ token }}</div>
  </div>
</template>

<script>
export default {
  name: "Test",

  data() {
    return {
      token: ''
    };
  },

  created(){
    this.token = window.localStorage.getItem('token')
  },

  methods: {
    clear() {
      window.localStorage.clear()
      this.token = ''
      alert('清除成功')
    },
    func1() {
      this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJlMzE3OTg0MDA4NjU0M2ViOWI1MmM0MmJkOTFmODk0YiIsInN1YiI6InRvbSIsImlzcyI6Im1vcm5kIiwiaWF0IjoxNjgxNTY1OTA3fQ.tdgnMBmMrup2muDyIKKyVT3IfONLbCKawvadRikY8VkbxrOGwr6PigWxDEswwXIe_n-OQJIoLAypGxqN05a6OA'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    },

    func2() {
      this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhOTdiODE0N2ExMTU0YTIzYjVlNWQ2YmEzYzkyYzNlMSIsInN1YiI6ImFsaWNlIiwiaXNzIjoibW9ybmQiLCJpYXQiOjE2ODE1NTk4MTV9.dtCz670opkHPfQhX-HH1jQ1iD35nqz7Zu7WLa61MGv_OHr7JMRKLb9Mmz2yNNKLAzCDmu4ZgH_if-Hla7Djx7w'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    },

    func3() {
      this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJjYzFkMjI3NjI2NTM0ZWRkOTExNGQ4ODU2MTYxY2RlMSIsInN1YiI6ImJvYiIsImlzcyI6Im1vcm5kIiwiaWF0IjoxNjgxNTU5OTI0fQ.-xpu-Dqp4Z6TFWpjjSfpccrEz6e6qi5nFU7xaUh1Mey6F4JkRGaCzsvTOg7xifBkRuMbqLH1dT1lcoSkUErsyA'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    }
  }
}
</script>
