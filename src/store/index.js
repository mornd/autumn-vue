import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import { setAllFriendsCache,setRecentUsersCache,setSessionCache } from "@/utils/chatUtil";

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
})

//  监听 store
// store.watch( state => {return state.chat.session}, value => {
//   // 聊天信息保存到浏览器缓存中
//   setSessionCache(value)
// }, {deep: true})

// store.watch( state => {return state.chat.recentUsers}, value => {
//   // 最近聊天用户保存到浏览器缓存中
//   setRecentUsersCache(value)
// }, {deep: true})
//
// store.watch( state => {return state.chat.allFriends}, value => {
//   // 所有聊天用户保存到浏览器缓存中
//   setAllFriendsCache(value)
// }, {deep: true})

export default store
