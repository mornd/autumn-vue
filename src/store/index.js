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

//  监听 store
store.watch( state => {return state.chat.session}, value => {
  localStorage.setItem('chat-session', JSON.stringify(value));
}, {deep: true})

export default store
