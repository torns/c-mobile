// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import Mobile from '../packages'
// import '../packages/index.scss'
import '../lib/css/style.css'
// import Mobile from '../lib/c-mobile'

Vue.config.productionTip = false
Vue.use(Mobile)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
