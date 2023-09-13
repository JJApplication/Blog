<template>
  <div class="article-detail" id="article-detail">
    <div v-if="canDisplay" id="theme" v-show="theme_control">
      <el-select v-model="theme" placeholder="代码主题" @change="change_theme">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div v-if="canDisplay" class="article-body">
      <div class="left-row">
        <div class="title-card animated fadeInDown">
          <div class="title">
            <p>{{ title }}</p>
          </div>
          <p style="color: #afafaf; font-size: 1rem; font-weight: bold">
            发布日期: {{ date }}
            <span style="margin: 0 0.75rem">
              <el-button type="primary" icon="el-icon-s-home" circle title="回到主页" @click="back"></el-button>
              <el-button type="primary" icon="el-icon-notebook-2" circle title="博客模式" @click="postMode"></el-button>
              <el-button type="primary" icon="el-icon-share" circle title="分享" @click="send_shares"></el-button>
              <el-button
                type="primary"
                icon="el-icon-chat-line-square"
                circle
                title="评论"
                @click="comment"
              ></el-button>
            </span>
          </p>
        </div>
        <el-card class="tag-card animated fadeInDown">
          <div slot="header" class="clearfix">
            <span>标签</span>
          </div>
          <el-tag style="margin: 0 4px" v-for="tag in tags" v-show="tag" :key="tag" type="info">
            <a style="color: #909399" :href="`/t/${tag}`">{{ tag }}</a>
          </el-tag>
        </el-card>
        <el-card class="count-card animated fadeInDown">
          <div slot="header" class="clearfix">
            <span>统计</span>
          </div>
          <p class="count-item">
            阅读次数:
            <span class="count">{{ post_views }}</span>
          </p>
          <p class="count-item">
            评论次数:
            <span class="count">{{ comments_count }}</span>
          </p>
          <p class="count-item">
            点赞次数:
            <span class="count">{{ post_likes }}</span>
          </p>
          <p class="count-item">
            分享次数:
            <span class="count">{{ post_shares }}</span>
          </p>
        </el-card>
        <el-card class="float-toc animated fadeInDown">
          <div slot="header" class="clearfix">
            <span>文章目录</span>
          </div>
          <el-tree
            :data="toc"
            @node-click="handleNodeClick"
            :highlight-current="true"
            :default-expand-all="true"
            :check-on-click-node="true"
          ></el-tree>
        </el-card>
      </div>
      <div class="right-row" :class="{ fitHeight: fitHeight }">
        <div id="wrapper" class="wrapper animated fadeIn">
          <div class="markdown-body gallery" v-html="post" id="markdown-body"></div>
          <!--评论区-->
          <div class="comment-wrapper">
            <el-divider></el-divider>
            <div id="comments">
              <div style="margin-bottom: 1rem">
                <!--                    评论标记-->
                <el-badge :value="comments_count" class="item">
                  <el-button disabled size="small">评论</el-button>
                </el-badge>
                <!--                    点赞标记-->
                <el-badge :value="post_likes" class="item" type="primary">
                  <el-button size="small" @click="send_likes">点赞</el-button>
                </el-badge>
                <!--                    分享标记-->
                <el-badge :value="post_shares" class="item" type="success">
                  <el-button size="small" @click="send_shares">分享</el-button>
                </el-badge>
                <!--                    访问标记-->
                <el-badge :value="post_views" class="item" type="info">
                  <el-button size="small">浏览</el-button>
                </el-badge>
              </div>
              <!--                    评论列表-->
              <div
                style="border: 1px solid var(--comment-border); margin-bottom: 0.6rem; border-radius: 4px"
                v-for="c in comments_list"
                :key="c.primary_id"
              >
                <div
                  style="
                    background-color: var(--comment-title-bg);
                    color: var(--comment-color);
                    font-size: 0.85rem;
                    font-weight: bold;
                    padding: 10px;
                    border-bottom: 1px solid var(--comment-border);
                  "
                >
                  <span style="color: var(--comment-user); margin-right: 0.6rem">{{ c.user ? c.user : '匿名' }}</span>
                  <span>评论于 {{ c.date }}</span>
                </div>
                <div style="padding: 10px" v-html="preview_code(c.comment)" class="markdown-body"></div>
              </div>
            </div>
            <!--                评论区-->
            <div id="user-comment">
              <el-tabs type="border-card">
                <el-tab-pane label="撰写评论">
                  <div>
                    <el-input
                      id="raw_textarea"
                      type="textarea"
                      show-word-limit
                      clearable
                      maxlength="200"
                      :rows="4"
                      placeholder="有什么想说的，留下你的评论吧✏️"
                      v-model="comment_text"
                    ></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="预览效果">
                  <div style="padding: 6px" v-html="preview_comment" class="markdown-body"></div>
                </el-tab-pane>
                <el-input
                  v-model="comment_who"
                  maxlength="20"
                  clearable
                  placeholder="表明你是谁😎"
                  size="mini"
                  style="width: 10rem; margin-top: 1rem"
                ></el-input>
                <el-button
                  type="primary"
                  size="mini"
                  @click="send_comment"
                  style="float: right; margin-top: 1rem; border: none"
                >
                  发布
                </el-button>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!canDisplay" style="padding: 2rem">
      <h1 style="margin: 1rem">阅读模式仅支持宽屏1440px及以上</h1>
      <el-button type="primary" @click="postMode">返回博客模式</el-button>
    </div>
    <el-backtop target=".right-row"></el-backtop>
    <bottom_banner></bottom_banner>
  </div>
</template>

<script>
import Top_banner from '../components/top_banner'
import Bottom_banner from '../components/bottom_banner'
import customData from '../custom/custom'
import api_article from '../api/article'
import { getCodeTheme, setCodeTheme } from '../store/store'
import markdownRender from '@/marked/marked'
import linkTo from '@/router/to'
import svg from '@/custom/svg'

export default {
  name: 'article',
  components: { Top_banner, Bottom_banner },
  data() {
    return {
      custom: customData,
      url: this.$route.params.url,
      post: null,
      title: null,
      date: null,
      tags: [],
      // coment
      comment_text: '',
      comment_who: '',
      preview_comment: '还没有任何内容',
      send_comment_tm: false,
      comments_count: 0,
      comments_list: [],
      // like
      post_likes: 0,
      send_likes_tm: false,
      // share
      post_shares: 0,
      send_shares_tm: false,
      // views
      post_views: 0,
      options: [
        {
          value: 'atom-one-dark',
          label: 'atom dark',
        },
        {
          value: 'atom-one-light',
          label: 'atom light',
        },
        {
          value: 'dracula',
          label: 'dracula',
        },
        {
          value: 'github',
          label: 'github',
        },
        {
          value: 'monokai',
          label: 'monokai',
        },
        {
          value: 'monokai-sublime',
          label: 'monokai sublime',
        },
        {
          value: 'ocean',
          label: 'ocean',
        },
        {
          value: 'rainbow',
          label: 'rainbow',
        },
        {
          value: 'solarized-dark',
          label: 'solarized dark',
        },
        {
          value: 'solarized-light',
          label: 'solarized light',
        },
        {
          value: 'tomorrow',
          label: 'tomorrow',
        },
        {
          value: 'tomorrow-night',
          label: 'tomorrow night',
        },
        {
          value: 'xcode',
          label: 'xcode',
        },
        {
          value: 'xt256',
          label: 'xterm',
        },
      ],
      theme: 'github',
      theme_control: false,
      loading_page: null,
      // toc
      levelMap: {
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
        H5: 5,
        H6: 6,
      },
      toc: [],
      canDisplay: true,
      // 文章高度
      fitHeight: false,
    }
  },
  created() {
    let _this = this
    _this.init_theme()
  },
  watch: {
    comment_text() {
      this.preview_comment = this.preview_code(this.comment_text)
    },
  },
  mounted() {
    this.canDisplay = document.body.clientWidth >= 1440
    window.onresize = () => {
      this.fitHeight = (document.body.clientHeight < document.getElementById("article-detail").clientHeight)
      this.canDisplay = document.body.clientWidth >= 1440
      if (this.canDisplay && !document.getElementById('wrapper')) {
        this.initPage()
      }
    }
    if (!this.canDisplay) {
      return
    }
    this.initPage()
    this.$nextTick(() => {
      this.fitHeight = (document.body.clientHeight < document.getElementById("article-detail").clientHeight)
    })
  },
  methods: {
    initPage() {
      let _this = this
      this.loading(customData.loading_duration * 5, false)
      this.$http
        .get(api_article.api_article_more, { params: { name: this.url } })
        .then((res) => {
          let content = res.data.data['content']
          _this.title = res.data.data['title']
          document.title = _this.title + ' • Blog'
          _this.date = res.data.data['date']
          _this.tags = res.data.data.tags.split(' ')
          _this.mk(content)
          _this.$nextTick(() => {
            this.theme_control = true
            let pres = document.getElementsByTagName('pre')
            for (let i = 0; i < pres.length; i++) {
              pres[i].classList.add('hljs')
            }
            this.loading(0, true)
          })
        })
        .catch((err) => {
          this.theme_control = true
          _this.$message.error('出现错误了，请求文章失败')
        })
      this.get_comments()
      this.get_likes()
      this.get_shares()
      this.get_views()
    },
    back() {
      this.$router.push('/home')
    },
    postMode() {
      window.location.href = `/p/${this.url}`
    },
    init(url) {
      let _this = this
      this.$http
        .get(api_article.api_article_more, { params: { name: url } })
        .then((res) => {
          let content = res.data.data['content']
          _this.title = res.data.data['title']
          _this.date = res.data.data['date']
          _this.mk(content)
          _this.$nextTick(() => {
            let pres = document.getElementsByTagName('pre')
            for (let i = 0; i < pres.length; i++) {
              pres[i].classList.add('hljs')
            }
          })
        })
        .catch((err) => {
          _this.$message.error('出现错误了，请求文章失败')
        })
    },
    preview_code(txt) {
      this.$nextTick(() => {
        // 只需渲染评论区
        let comment_part = document.getElementById('comments')
        let pres = comment_part.getElementsByTagName('pre')
        for (let i = 0; i < pres.length; i++) {
          pres[i].classList.add('hljs')
        }
        // 渲染区
        let comment_preview_part = document.getElementById('user-comment')
        pres = comment_preview_part.getElementsByTagName('pre')
        for (let i = 0; i < pres.length; i++) {
          pres[i].classList.add('hljs')
        }
      })
      return markdownRender(txt)
    },
    mk(code) {
      this.$nextTick(() => {
        this.reformat_images()
        this.reformat_head()
      })
      this.post = markdownRender(code)
    },
    loading(sec, hide) {
      if (sec !== 0) {
        this.loading_page = this.$loading({
          lock: true,
          text: '文章加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }
      if (hide && !this.loading_page) {
        this.loading_page.close()
      } else {
        setTimeout(() => {
          this.loading_page.close()
        }, sec)
      }
    },
    init_theme() {
      // 存在主题配置时使用配置
      this.theme = getCodeTheme(customData.default_theme)
      this.change_theme()
    },
    // 基于字典的动态样式
    change_theme() {
      // 每次更换前都移除上一次的样式
      let head = document.getElementsByTagName('head')[0]
      let linkTag = document.getElementById('dynamic-theme')
      let href_prefix = customData.highlightjs_cdn
      let href = this.theme
        ? href_prefix + this.theme + '.min.css'
        : href_prefix + customData.default_theme + '.min.css'
      console.log('使用主题' + this.theme)
      setCodeTheme(this.theme)
      linkTag.setAttribute('href', href)
    },
    // 渲染图片资源 使用lightbox
    // 对于主页的多body情况 使用遍历方案
    reformat_images() {
      let item = document.getElementById('markdown-body')
      // 获取item中的images
      let img = item.getElementsByTagName('img')
      for (let i = 0; i < img.length; i++) {
        // 重新构造img标签
        // 是否构造看img是否存在lightbox属性
        if (!img[i].getAttribute('lightbox')) {
          // 获取img的父亲
          let img_parent = img[i].parentNode
          let data_img_alt = 'images' + i
          let href = img[i].src
          let light_box_attr = document.createElement('a')
          img[i].setAttribute('lightbox', 'true')
          light_box_attr.href = href
          light_box_attr.classList.add('spotlight')
          light_box_attr.setAttribute('data-image-alt', data_img_alt)
          // 新建参考坐标
          light_box_attr.append(img[i])
          img_parent.append(light_box_attr)
        }
      }
    },
    // 插入伪元素 链接全部的标题1-3大标题
    reformat_head() {
      let body = document.getElementById('markdown-body')
      let heads = body.querySelectorAll('h1, h2, h3')
      for (let h of heads) {
        let svg_icon = svg.postLink
        // 为避免id转义的问题使用text获取
        let text_inner = h.innerText
        let text_id = encodeURI(text_inner)
        // 设置ID
        h.id = text_inner
        h.innerHTML = `<a class="head-link" href="#${text_id}">${svg_icon}</a>` + text_inner
      }
      this.generate_toc()
    },
    // 获取全部评论 并进行渲染
    get_comments() {
      this.$http.get(api_article.api_article_comments, { params: { name: this.url } }).then((res) => {
        let d = res.data.data
        if (d) {
          this.comments_count = d.length
          this.comments_list = d
        }
      })
    },
    // 发布评论 记得做防抖处理
    send_comment() {
      if (this.send_comment_tm === false) {
        this.send_comment_tm = true
        setTimeout(() => {
          this.send_comment_tm = false
        }, 1000)
      } else {
        this.$message('请稍后再试')
        return
      }
      let comment = this.comment_text
      if (!comment || !this.url) {
        this.$message.info('请输入有效的评论')
        return
      }
      let data = {
        name: this.url,
        user: this.comment_who,
        comment: comment,
      }
      this.$http
        .post(api_article.api_article_comments, data)
        .then((res) => {
          let d = res.data.data
          if (d) {
            this.$message.success('评论发布成功')
            this.comment_text = ''
            this.get_comments()
          }
        })
        .catch(() => {
          this.$message.error('评论发布失败')
        })
    },
    get_likes() {
      this.$http.get(api_article.api_article_likes, { params: { name: this.url } }).then((res) => {
        if (res.data.data && res.data.data !== 'failed') {
          this.post_likes = res.data.data
        }
      })
    },
    get_shares() {
      this.$http.get(api_article.api_article_shares, { params: { name: this.url } }).then((res) => {
        if (res.data.data && res.data.data !== 'failed') {
          this.post_shares = res.data.data
        }
      })
    },
    send_likes() {
      if (!this.send_likes_tm) {
        this.send_likes_tm = true
        setTimeout(() => {
          this.send_likes_tm = false
        }, 2000)
        this.$http.post(api_article.api_article_likes, { name: this.url }).then((res) => {
          if (res.data.data && res.data.data === 'success') {
            this.$message.success('点赞完毕')
            this.get_likes()
          } else {
            this.$message.success('点赞失败')
          }
        })
      } else {
        this.$message.info('请不要重复点击')
      }
    },
    send_shares() {
      let uri = customData.http_prefix + '://' + customData.site_domain + '/article/' + this.url
      let link =
        '<pre style="background-color: #f5f5f5;color: crimson;padding: 10px;border-radius: 4px">' +
        uri +
        '</pre><br><strong>Copyright ©️ renj.io</strong>'
      this.$alert(link, '复制本文链接以分享', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '我知道了',
        callback: (action) => {
          this.$message.success('分享完毕')
          this.$http.post(api_article.api_article_shares, { name: this.url }).then((res) => {
            if (res.data.data && res.data.data === 'success') {
              this.get_shares()
            }
          })
        },
      })
    },
    get_views() {
      this.$http.get(api_article.api_article_views, { params: { name: this.url } }).then((res) => {
        if (res.data.data) {
          this.post_views = res.data.data
        }
      })
    },
    // 生成TOC
    generate_toc() {
      // 先找markdown-body
      const body = document.querySelector('#markdown-body')
      // 仅渲染到4级目录
      const headerList = body.querySelectorAll('h1, h2, h3, h4')
      // 树结构生成算法
      let tree = { label: 'root', children: [], level: 0 }
      const levelMap = this.levelMap
      headerList.forEach((header) => {
        addNode(tree, header)
      })
      this.toc = tree.children

      function addNode(tree, node) {
        if (!tree.label) {
          tree.label = node.innerText
          tree.children = []
          tree.level = levelMap[node.nodeName]
          return
        }
        // 只要属于子节点就塞进去
        if (tree.level < levelMap[node.nodeName]) {
          // 不存在children则新增
          if (tree.children.length === 0) {
            tree.children.push({ label: node.innerText, children: [], level: levelMap[node.nodeName] })
            return
          }
          // 同等级仅对比最后一个children
          const t = tree.children[tree.children.length - 1]
          if (t.level < levelMap[node.nodeName]) {
            addNode(t, node)
          } else {
            tree.children.push({ label: node.innerText, children: [], level: levelMap[node.nodeName] })
          }
        } else {
          tree.children.push({ label: node.innerText, children: [], level: levelMap[node.nodeName] })
        }
      }
    },
    handleNodeClick(data) {
      window.location.href = `#${encodeURI(data.label)}`
    },
    comment() {
      linkTo('#user-comment')
    },
  },
}
</script>

<style scoped>
::-webkit-scrollbar-thumb {
  background-color: transparent;
}
.article-detail {
  padding: 2rem 1rem 0.5rem 1rem;
  max-width: 1520px;
  margin: 0 auto;
}
.title-card {
  margin-left: 0.5rem;
}
.title {
  width: fit-content;
  font-weight: bold;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}
.article-body {
  width: 100%;
  display: flex;
}
.left-row {
  text-align: left;
  padding: 1rem;
  position: relative;
  width: 25rem;
  user-select: none;
}
.left-row .tag-card {
  margin-top: 1rem;
  min-width: 25rem;
}
.left-row .count-card {
  margin-top: 1rem;
  min-width: 25rem;
}
.left-row .count-card .count-item {
  font-size: 0.85rem;
}
.left-row .count-card .count-item .count {
  font-weight: bold;
  margin: 0 0.5rem;
}
.left-row .float-toc {
  margin-top: 1rem;
  min-width: 25rem;
}
.right-row {
  width: calc(100% - 25rem);
  height: calc(100vh - 8rem);
  padding-bottom: 2rem;
  overflow-y: auto;
  cursor: pointer;
}
.fitHeight {
  height: calc(100vh - 5rem);
}

.left-row /deep/ .el-card {
  background-color: var(--card-bg);
  color: var(--card-color);
  border: 1px solid var(--card-border);
}
.left-row /deep/ .el-card .el-card__header {
  border-bottom: 1px solid var(--card-border);
}
.left-row /deep/ .el-tree {
  background-color: var(--card-bg);
  color: var(--card-color);
}
.left-row /deep/ .el-tree-node__content:hover,
.left-row /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: var(--tree-select-bg);
  color: var(--card-color);
}
#theme {
  position: fixed;
  z-index: 999;
  right: 20px;
  top: 20px;
  max-width: 120px;
  transition: all 0.3s ease;
}
#theme /deep/ .el-input__inner {
  background-color: var(--post-background);
  border-color: var(--select-border);
}
#theme /deep/ .el-select .el-input.is-focus .el-input__inner {
  border-color: var(--border-color);
  background-color: var(--post-background);
}
#theme /deep/ .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: var(--border-color);
  background-color: var(--post-background);
}
#theme /deep/ .el-select .el-input__inner:focus {
  border-color: var(--border-color);
  background-color: var(--post-background);
}

@media (max-width: 640px) {
  #theme {
    right: 8px;
    top: 34px;
    max-width: 80px;
    transition: all 0.3s ease;
  }
  #theme /deep/ .el-input {
    font-size: 12px;
  }
  #theme /deep/ .el-input--suffix .el-input__inner {
    padding-right: 16px;
  }
  #theme /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
    padding: 0 0 0 8px;
  }
  #theme /deep/ .el-input__icon {
    line-height: 32px;
    width: 15px;
  }
}
.wrapper {
  text-align: left;
  box-shadow: 0 1px 10px 2px var(--post-box);
  border-radius: 2px;
  max-width: 980px;
  margin: 15px auto 0;
  background-color: var(--post-background);
}
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 25px;
  color: var(--text-color);
}
@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
<style scoped>
.comment-wrapper {
  padding: 0 0 2rem 0;
  width: 80%;
  margin: 1rem auto 0 auto;
}
@media (max-width: 480px) {
  .comment-wrapper {
    width: 90%;
  }
}
.comment-wrapper /deep/ .el-textarea__inner:focus {
  border: none;
}
.comment-wrapper /deep/ .el-textarea__inner:hover {
  border: none;
}
.comment-wrapper /deep/ .el-input__inner:hover {
  border: none;
}
.comment-wrapper /deep/ .el-input__inner:focus {
  border: none;
}
#comments .item {
  margin-right: 2rem;
}
@media (max-width: 400px) {
  #comments .item {
    margin-right: 1rem;
  }
}
</style>
<style>
#raw_textarea {
  background-color: var(--comment-area-bg);
  color: var(--comment-area-color);
  border-color: var(--border-color);
  border: none;
}
#user-comment .el-tabs--border-card,
#user-comment .el-tabs--border-card > .el-tabs__header {
  background-color: var(--comment-bg);
  border: none;
}
#user-comment .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: var(--comment-tab);
  border-right-color: var(--border-color);
  border-left-color: var(--border-color);
}
#user-comment .el-textarea .el-input__count {
  background-color: transparent;
}
#user-comment .el-input__inner {
  border-color: var(--border-color);
}
#comments {
  margin-bottom: 1rem;
}
</style>
<style>
@import '../custom/custom.css';
</style>