<template>
  <div>
    <div>账号切换</div>
    <button @click="testf()" type="default" size="mini">test</button>
    <button @click="bobf()" type="default" size="mini">bob</button>
    <button @click="f3()" type="default" size="mini">admin</button>
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
    testf() {
      this.token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTgwMzBiYzE0ODU0YjlmOTdjMWUwNmRmZTY3Y2M1NSIsInN1YiI6InRlc3QiLCJpc3MiOiJtb3JuZCIsImlhdCI6MTY4MDY4OTA5OH0.eOWj-bwK-E_pXUZaAE9HBPNzYdez3HIBbXjns-0do-o6bQrFl5Rra1Cm5GjLEJ0_F_09_L631rp2EV7zb5wTrg'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    },

    bobf() {
      this.token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJjZDkzNTJmZGQ0ZGM0MTg2YWY1NGIwYWNjNDRlOWQ4YyIsInN1YiI6ImJvYiIsImlzcyI6Im1vcm5kIiwiaWF0IjoxNjgwNjg5MTk0fQ.uPbgluKGt_w19Ft779lwNJCkHBQn3rlBOO14Tomww8EeEEEnzb775SwJ-GyVqZLv0Gau_LyO2UYC2mb1lg_dYQ'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    },

    f3() {
      this.token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI3NDAyZTMyZjA4NzU0M2JmYmE3MTc4OWQzMTliM2MwNCIsInN1YiI6InRvbSIsImlzcyI6Im1vcm5kIiwiaWF0IjoxNjgwNjEyMzc5fQ.q57-sL9g22jkqBpbq_ez5KZFmnLx9bUgWmUNOwcTtSAqfRj7PX3i-QH8paE_SjcvXInouRWj8D3fFZCalKjrQQ'
      window.localStorage.setItem('token', this.token);
      alert('切换成功')
    }
  }
}
</script>
