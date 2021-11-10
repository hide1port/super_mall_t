import Vue from 'vue'
import App from './App.vue'
import router from "@/router";

Vue.config.productionTip = false

//添加事件总线，用于给没有特定关系的两个组件传递事件
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
