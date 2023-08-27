<template>
  <div id="what-new">
    <h1 style="margin: 2rem 0">What's New in Blog NEXT?</h1>
    <el-card class="box-card">
      <p>全新设计的主页</p>
      <p>使用Vite构建</p>
      <p>完整的DarkMode适配</p>
      <p>控制台支持markdown在线编辑</p>
      <p>完整的附件上传功能</p>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'new'
}
</script>
<style scoped>
#what-new {
  padding: 4rem 0;
}
#what-new .box-card {
  max-width: 960px;
  margin: 0 auto;
}
#what-new .box-card p {
  margin: 0.75rem 0;
  border-bottom: 1px solid #F0F0F0;
  padding: 1rem;
}
</style>