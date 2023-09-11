<template>
  <div id="next-home">
    <div class="next-header">
      <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal">
        <el-menu-item index="1" style="font-weight: bold">Blog • NEXT</el-menu-item>
        <el-submenu index="2" :popper-append-to-body="false">
          <template slot="title">文章</template>
          <el-menu-item index="2-1"><a href="/home">首页</a></el-menu-item>
          <el-menu-item index="2-2"><a href="/search">搜索</a></el-menu-item>
          <el-menu-item index="2-3"><a href="/tags">标签</a></el-menu-item>
          <el-menu-item index="2-4"><a href="/archive">归档</a></el-menu-item>
          <el-menu-item index="2-4"><a href="/message">留言</a></el-menu-item>
          <el-submenu index="2-5" :popper-append-to-body="false">
            <template slot="title">管理</template>
            <el-menu-item index="2-5-1"><a href="/login">登录</a></el-menu-item>
            <el-menu-item index="2-5-2">
              <a href="/overview">架构总览</a>
            </el-menu-item>
            <el-menu-item index="2-5-3">
              <a href="/dashboard">后台面板</a>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3"><a href="/zhuanlan">专栏</a></el-menu-item>
        <el-menu-item index="4"><a href="/about">关于</a></el-menu-item>
        <el-menu-item index="5"><a href="/new" target="_blank">What's new</a></el-menu-item>
        <el-menu-item index="5"><a :href="custom.github_url" target="_blank">Github</a></el-menu-item>
        <el-menu-item index="5"><a :href="custom.project_url" target="_blank">Mgek APP</a></el-menu-item>
        <el-menu-item index="5"><a :href="custom.jjapplication_url" target="_blank">JJAPP</a></el-menu-item>
      </el-menu>
    </div>
    <div style="position:relative;height: 100%;width: 100%">
      <div class="next-banner">
      </div>
      <div class="next-body">
        <h1 class="animated fadeInDown" @click="explore">
          Welcome to Blog
          <span style="color: #995de3">NEXT</span>
        </h1>
        <p
            class="animated fadeInDown"
            style="
            text-align: left;
            color: #ffbb5b;
            margin: 1rem 0;
            font-size: 1rem;
            background-color: #1f211895;
            padding: 0.75rem 1rem;
          "
        >
          What makes life dreary is the want of motive.
        </p>
        <div class="explore animated fadeInDown" @click="explore">Explore</div>
      </div>
    </div>
    <div class="footer" title="Hello, this is Blog NEXT version">
      <div>Blog - NEXT</div>
    </div>
  </div>
</template>
<script>
import custom from '@/custom/custom'
import linkTo from "@/router/to";

export default {
  name: 'next',
  computed: {
    custom() {
      return custom
    },
  },
  data() {
    return {
      activeIndex: '0',
    }
  },
  methods: {
    explore() {
      linkTo('/home')
    },
  },
}
</script>
<style scoped>
#next-home {
  height: 100%;
  position: relative;
}
.next-header {
  position: absolute;
  display: block;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: transparent;
}
.next-header .el-menu {
  height: 3rem;
  background-color: #100e0e85;
}
#next-home /deep/ .el-menu.el-menu--horizontal {
  border-bottom: none;
}
#next-home /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 3rem;
  line-height: 3rem;
  color: #ffffff;
}
#next-home /deep/ .el-menu--horizontal > .el-menu-item {
  height: 3rem;
  line-height: 3rem;
  color: #ffffff;
}
#next-home /deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
#next-home /deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
#next-home /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #100e0e85;
}

#next-home /deep/ .el-menu--horizontal .el-menu .el-menu-item,
#next-home /deep/ .el-menu--horizontal .el-menu .el-submenu__title {
  background-color: #100e0e85;
  color: #ffffff;
}

#next-home /deep/ .el-menu--horizontal .el-menu .el-menu-item a,
#next-home /deep/ .el-menu--horizontal .el-menu .el-submenu__title a,
#next-home /deep/ .el-menu--horizontal .el-menu-item i,
#next-home /deep/ .el-menu--horizontal .el-submenu__title i {
  color: #ffffff;
}

#next-home /deep/ .el-submenu .el-menu {
  background-color: transparent;
}
#next-home /deep/ .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
#next-home /deep/ .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: #100e0e65;
}
#next-home /deep/ .el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
#next-home /deep/ .el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: none;
}
.next-banner {
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('../assets/background.webp');
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.85;
  filter: blur(0);
}
.next-body {
  position: fixed;
  top: calc(50% - 8rem);
  left: 5rem;
}
.next-body h1 {
  text-align: left;
  margin: 1rem 0;
  color: #f5f5f5;
  font-size: 5rem;
  transition: all 0.3s ease;
}
.next-body h1:hover {
  padding: 1rem;
  font-size: 5.25rem;
  background: linear-gradient(45deg, #5c5cff, #ffbcc7);
  transition: all 0.3s ease;
}
.next-body .explore {
  display: block;
  width: 10rem;
  background-color: #995de3;
  padding: 1.25rem 2rem;
  font-size: 1.5rem;
  color: #ffeded;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.next-body .explore:hover {
  background-color: #7624db;
}
@media (max-width: 840px) {
  .next-body {
    position: fixed;
    top: calc(50% - 10rem);
    left: 0;
    padding: 0 1rem;
  }
  .next-body h1 {
    font-size: 3.5rem;
  }
  .next-body h1:hover {
    padding: 0.5rem;
    font-size: 3.75rem;
  }
  .next-body .explore {
    width: 8rem;
    padding: 1rem 1.5rem;
    font-size: 1.25rem;
    transition: all 0.3s ease;
  }
}
.footer {
  color: #FFFFFF;
  font-weight: bold;
  font-size: 0.85rem;
  position: absolute;
  z-index: 999;
  bottom: 1rem;
  right: 1rem;
}
</style>
