// 可自由定制的项目
// 在打包的时候使用
let prefix = 'https:' === document.location.protocol ? 'https' : 'http'
let api_server = import.meta.env.DEV ? 'http://renj.io:5000' : ''
const customData = {
  // 前端分离时使用
  api_url: api_server,
  author: 'Landers',
  top_banner: 'Landers1037',
  top_span: '须知少时凌云志 曾许人间第一流',
  site_name: 'http://renj.io',
  site_url: 'http://renj.io',
  http_prefix: prefix,
  site_domain: 'blog.renj.io',
  github: 'landers1037',
  github_url: 'https://github.com/landers1037',
  project: 'mgek.cc',
  project_des: 'Mgek项目记录生活中的灵感',
  project_url: 'http://mgek.cc',
  jjapplication_url: 'https://github.com/jjapplication',
  blog_project_url: 'https://github.com/landers1037/blog',
  bottom_tag: 'By Landers',
  bottom_url: 'http://renj.io',
  bottom_tag2: 'Github',
  bottom_url2: 'https://landers1037.github.io',
  bottom_span: 'Golang & Vue',
  email: 'liaorenj@gmail.com',
  start_year: '2017',
  start_date: '2017/7/1',
  dashboard_count: 1,
  // default theme support github|monokai|atom|xterm|solarized|xcode
  highlightjs_cdn: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.6.0/build/styles/',
  default_theme: 'xt256',
  message_duration: 1500,
  loading_duration: 1000,
}

export default customData
