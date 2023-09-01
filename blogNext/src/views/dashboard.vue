<template>
  <div class="dashboard">
    <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">文章管理</el-menu-item>
      <el-submenu index="2">
        <template slot="title">统计数据管理</template>
        <el-menu-item index="2-1">访问量管理</el-menu-item>
        <el-menu-item index="2-2">分享量管理</el-menu-item>
        <el-menu-item index="2-3">点赞量管理</el-menu-item>
        <el-menu-item index="2-4">评论 管理</el-menu-item>
        <el-menu-item index="2-5">统计可视化</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">专栏管理</el-menu-item>
      <el-menu-item index="4">留言管理</el-menu-item>
      <el-menu-item index="5">图片管理</el-menu-item>
      <el-menu-item index="6" @click="logout">退出登录</el-menu-item>
      <el-menu-item index="7"><a href="/">返回主页</a></el-menu-item>
    </el-menu>
    <div class="dynamic-area">
      <!--            动态组件-->
      <component :is="dynamic_com"></component>
    </div>
  </div>
</template>

<script>
import post_card from '../components/post_card'
import zhuanlan_card from '../components/zhuanlan_card'
import message_card from '../components/message_card'
import view_card from '../components/view_card'
import share_card from '../components/share_card'
import like_card from '../components/like_card'
import comment_card from '../components/comment_card'
import show_card from '../components/show_card'
import image_card from '@/components/image_card.vue'
import { rmToken } from "@/store/store";
export default {
  name: 'dashboard',
  components: {
    post_card,
    zhuanlan_card,
    message_card,
    view_card,
    like_card,
    share_card,
    comment_card,
    show_card,
    image_card,
  },
  data() {
    return {
      activeIndex: '1',
      dynamic_com: '',
      components_map: {
        '1': 'post_card',
        '2-1': 'view_card',
        '2-2': 'share_card',
        '2-3': 'like_card',
        '2-4': 'comment_card',
        '2-5': 'show_card',
        '3': 'zhuanlan_card',
        '4': 'message_card',
        '5': 'image_card',
      },
    }
  },
  mounted() {
    this.dynamic_com = 'post_card'
  },
  methods: {
    handleSelect(key, keyPath) {
      this.dynamic_com = this.components_map[key]
    },
    logout() {
      rmToken()
      this.$message('你已经登出 即将返回主页')
      setTimeout(() => {
        this.$router.push('/')
      }, 1500)
    },
  },
}
</script>

<style scoped>
.dynamic-area {
  padding: 10px;
  text-align: left;
}
.dashboard /deep/ .el-menu--horizontal > .el-menu-item.is-active,
.dashboard /deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
  background-color: var(--header-menu-bg);
  color: var(--header-menu-text-active);
}
.dashboard /deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.dashboard /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: var(--header-menu-bg);
  color: var(--header-menu-text);
}
</style>
