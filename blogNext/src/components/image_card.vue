<template>
  <div class="image_card">
    <p style="padding: 10px 4px">管理图片资源</p>
    <el-table :data="image_list" max-height="calc(100vh - 150px)" border style="width: 100%; overflow-y: auto">
      <el-table-column prop="index" label="序号" width="120"></el-table-column>
      <el-table-column prop="name" sortable label="图片名称"></el-table-column>
      <el-table-column prop="size" sortable width="200" label="图片大小"></el-table-column>
      <el-table-column width="160" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleShow(scope.$index, scope.row.name)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="图片预览" width="80%" :visible.sync="show">
      <div class="image-wrapper">
        <el-image :src="src"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api_image from '@/api/image'

export default {
  name: 'image_card',
  data() {
    return {
      image_list: [],
      show: false,
      src: '',
    }
  },
  mounted() {
    this.get_image_list()
  },
  methods: {
    get_image_list() {
      let that = this
      this.$http.get(api_image.list).then((res) => {
        if (res.status !== 200) {
          this.$message.error('获取图片列表失败')
        } else {
          this.image_list = res.data.map((d, i) => {
            return {
              index: i,
              name: d.name,
              size: that.getRealSize(d.size),
            }
          })
        }
      })
    },
    getRealSize(size) {
      return `${(size / 1024).toFixed(2)}kb`
    },
    handleDelete(index, name) {
      this.$http
        .post(api_image.delete, {},{
          params: {
            file: name,
          },
        })
        .then((res) => {
          if (res.status !== 200) {
            this.$message.error('图片' + name + '删除失败')
          } else {
            this.$message.success('图片' + name + '删除成功')
            this.get_image_list()
          }
        })
    },
    handleShow(index, name) {
      this.src = `/images/${name}`
      this.show = true
    },
  },
}
</script>

<style scoped>
/* 暗黑模式的适配 */
.image_card /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: var(--body-background);
}
.image_card /deep/ .el-table,
.image_card /deep/ .el-table__expanded-cell {
  background-color: var(--body-background);
}
.image_card /deep/ .el-textarea__inner {
  background-color: var(--comment-bg);
}
.image_card .image-wrapper {
  padding: 1rem;
  box-shadow: 0 0 10px 10px #f0f0f0;
}
</style>
