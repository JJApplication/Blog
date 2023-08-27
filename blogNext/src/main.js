import Vue from 'vue'
import './elem/element.js'

import App from './App.vue'
import router from './router'
import httprequest from "./axios";
import customData from "./custom/custom";
import { Message } from 'element-ui';

import VMdEditor from '@kangc/v-md-editor';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js/lib/core';
// 按需引入语言包
import json from 'highlight.js/lib/languages/json';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import c from 'highlight.js/lib/languages/c';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import lua from 'highlight.js/lib/languages/lua';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import yaml from 'highlight.js/lib/languages/yaml';
import ini from 'highlight.js/lib/languages/ini';
//从cdn引入js文件

Vue.config.productionTip = false;
Vue.prototype.$http = httprequest;

Vue.use(httprequest);

// 覆盖messagebox
Vue.prototype.$message = function (msg) {
  Message(msg)
}
Vue.prototype.$message = function(msg){
  return Message({
    message: msg,
    duration: customData.message_duration
  })

}
Vue.prototype.$message.success = function (msg) {
  return Message.success({
    message: msg,
    duration: customData.message_duration
  })
}
Vue.prototype.$message.warning = function (msg) {
  return Message.warning({
    message: msg,
    duration: customData.message_duration
  })
}

Vue.prototype.$message.error = function (msg) {
  return Message.error({
    message: msg,
    duration: customData.message_duration
  })
}
Vue.prototype.$message.info = function (msg) {
  return Message.info({
    message: msg,
    duration: customData.message_duration
  })
}

hljs.registerLanguage('json', json);
hljs.registerLanguage('go', go);
hljs.registerLanguage('golang', go);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('c', c);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('lua', lua);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('ini', ini);

VMdEditor.use(githubTheme, {
  Hljs: hljs
});

Vue.use(VMdEditor);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
