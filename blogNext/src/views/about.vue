<template>
  <div class="about">
    <div class="head">
      <h1 style="margin-bottom: 40px">关于</h1>
      <h3 style="margin: 1rem 0">Blog - NEXT</h3>
      <p>博客项目开始于2020年，迭代更新了很多版本， 一开始只是简单地做一个博客网站。<br>
        渐渐地我开始意识到博客应该有什么东西，应该向他人表达什么，希望这些东西在BlogNEXT上能够以最直观的方式呈现出来
      </p>
    </div>
    <div style="margin-top: 40px">
      <ul>
        我的个人主页
        <a :href="custom.site_url">{{ custom.site_name }}</a>
      </ul>
      <ul>
        我的Github
        <a :href="'https://github.com/' + custom.github">{{ custom.github }}</a>
      </ul>
    </div>
    <div class="thanks">
      <p style="font-size: 1.4rem">感谢</p>
      <p>感谢你的来访，也欢迎你能给我的博客提出宝贵的建议</p>
      <p>保持对技术的热爱很难，但是人生嘛总要有些东西可以一直坚持下去</p>
      <ul>
        框架
        <a href="https://cn.vuejs.org/">Vuejs</a>
      </ul>
      <ul>
        引擎
        <a href="https://github.com/gin-gonic/gin">Gin</a>
      </ul>
      <ul>
        证书
        <a href="https://freessl.cn/">FreeSSL</a>
      </ul>
      <ur>
        图标
        <a href="https://www.iconfont.cn/">iconfont</a>
      </ur>
    </div>
    <div style="margin-bottom: 1.6rem; font-weight: bold">
      <p style="font-size: 1.4rem">框架设计 - renj.io</p>
      <p style="padding: 10px"><a href="https://github.com/JJApplication/Blog/tree/next">JJAPP/BlogNext</a></p>
    </div>
    <div style="margin-bottom: 1.6rem; font-weight: bold">
      <p style="font-size: 1.4rem">404页面设计 - renj.io</p>
      <p style="padding: 10px"><a href="/404">Error page not found</a></p>
    </div>

    <el-button type="primary" @click="back">返回主页</el-button>
  </div>
</template>

<script>
import customData from '../custom/custom'
export default {
  name: 'about',
  data() {
    return {
      custom: customData,
    }
  },
  methods: {
    back() {
      //this.$router.push("/")
      window.history.back()
    },
  },
}
</script>

<style scoped>
.about {
  padding: 20px 10px;
  max-width: 640px;
  margin: 0 auto;
}
.about a {
  font-weight: bold;
}
.thanks {
  padding: 20px 0 30px 0;
  text-align: left;
  width: 260px;
  margin: 0 auto;
}
.thanks p {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}
</style>
<style>
@import '../custom/custom.css';
</style>
