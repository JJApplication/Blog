<template>
  <div class="tags">
    <div class="list">
      <el-tag class="tag" v-for="tag in tagsList" @click="link(tag)" effect="dark" :key="tag">{{ tag }}</el-tag>
    </div>
    <el-button type="primary" @click="back">返回主页</el-button>
  </div>
</template>
<script>
import api_tags from '@/api/tag'

export default {
  name: 'tags',
  data() {
    return {
      tagsList: [],
    }
  },
  methods: {
    getTags() {
      let _this = this
      _this.$http
        .get(api_tags.api_tags_all)
        .then((res) => {
          const tags = res.data.data
          const realTags = []
          tags.forEach((d) => {
            realTags.push(d.tag)
          })
          _this.tagsList = realTags
        })
        .catch((err) => {
          this.$message.error('出现错误了，请求标签失败')
        })
    },
    back() {
      this.$router.push('/')
    },
    link(tag) {
      this.$router.push(`/t/${encodeURI(tag)}`)
    },
  },
  mounted() {
    this.getTags()
  },
}
</script>
<style scoped>
.tags .list {
  max-width: 640px;
  margin: 0 auto;
  padding: 4rem 1rem;
}
.tags .list .tag {
  margin: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0 16px;
  height: 40px;
  line-height: 38px;
  border: none;
}

.tags .list .tag:hover {
  background-color: #346ba4;
  border: none;
  transition: all 0.3s ease;
}
</style>
