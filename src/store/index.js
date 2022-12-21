import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
})

store.watch(function (state) {
  return state.sessions
},function (val) {
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true
})

export default store
