import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import jquery from 'jquery'
import vueSimpleUploader from 'vue-simple-uploader'

Vue.use(vueSimpleUploader)
Vue.config.productionTip = false
Vue.prototype._$ = jquery

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
