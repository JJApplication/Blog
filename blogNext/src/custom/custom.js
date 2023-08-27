// 可自由定制的项目
// 在打包的时候使用
let prefix = 'https:' === document.location.protocol ? 'https' : 'http'
const customData = {
  // 前端分离时使用
  // api_url: prefix + "://127.0.0.1:5000",
  api_url: '',
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
  bottom_tag: 'By Landers',
  bottom_url: 'http://renj.io',
  bottom_tag2: 'Github',
  bottom_url2: 'https://landers1037.github.io',
  bottom_span: 'Golang & Vue',
  email: 'mail@renj.io',
  start_year: '2017',
  start_date: '2017/7/1',
  dashboard_count: 1,
  // default theme support github|monokai|atom|xterm|solarized|xcode
  default_theme: 'xt256',
  message_duration: 1500,
  loading_duration: 1000,
}

export default customData
