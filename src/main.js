import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import 'assets/css/base.styl'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/font/iconfont.css'

// 导入自定义全局方法
import global from 'components/common/global.js'

Vue.use(global)
Vue.use(ElementUI)
Vue.use(VueCompositionApi)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
