<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
@import './assets/github-markdown.min.css';
@import './assets/theme.css';
@import './assets/common.css';
* {
  margin: 0;
  padding: 0;
  min-font-size: 10px;
}
html,
body {
  height: 100% !important;
  background-color: var(--body-background);
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Lato, Helvetica, 'PingFang SC', 'Heiti SC', 'Source Han Sans SC', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  text-align: center;
  color: var(--text-color);
  position: relative;
  background-color: var(--body-background) !important;
  overflow-y: auto;
  height: inherit;
  /*对于所有图片背景去除  */
}

#app img {
  background-color: transparent !important;
}

@media (max-width: 480px) {
  #app {
    -webkit-tap-highlight-color: transparent;
  }
}
@font-face {
  font-face-name: mo;
  font-family: mo;
  src: url('assets/Monaco.woff2') format('woff');
  font-display: fallback;
  font-style: normal;
}
@media (prefers-color-scheme: light) {
  .svg.link {
    fill: #2C2F2D;
  }
}
@media (prefers-color-scheme: dark) {
  .svg.link {
    fill: #d1556f;
  }
}
/* 覆盖全部backtop样式 */
.el-backtop {
  background-color: var(--backtop-bg);
}
.el-backtop:hover {
  background-color: var(--backtop-hover-bg);
}
</style>
