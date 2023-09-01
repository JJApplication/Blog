// 通用的marked-it渲染
import { marked } from 'marked'
import hljs from './highlight'

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (c) {
    return hljs.highlightAuto(c).value
  },
  pendantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  xhtml: false,
})

export default function markdownRender(text) {
  return marked(text)
}
