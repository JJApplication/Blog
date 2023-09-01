import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import request from './axios'
import customData from './custom/custom'
import './custom/welcome'
import './custom/console'
import { Message } from 'element-ui'

import VMdEditor from '@kangc/v-md-editor'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from './marked/highlight'

Vue.config.productionTip = false
Vue.prototype.$http = request

Vue.use(request)

Vue.use(Element)

// 覆盖messagebox
Vue.prototype.$message = function (msg) {
  Message(msg)
}
Vue.prototype.$message = function (msg) {
  return Message({
    message: msg,
    duration: customData.message_duration,
  })
}
Vue.prototype.$message.success = function (msg) {
  return Message.success({
    message: msg,
    duration: customData.message_duration,
  })
}
Vue.prototype.$message.warning = function (msg) {
  return Message.warning({
    message: msg,
    duration: customData.message_duration,
  })
}

Vue.prototype.$message.error = function (msg) {
  return Message.error({
    message: msg,
    duration: customData.message_duration,
  })
}
Vue.prototype.$message.info = function (msg) {
  return Message.info({
    message: msg,
    duration: customData.message_duration,
  })
}

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

Vue.use(VMdEditor)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
