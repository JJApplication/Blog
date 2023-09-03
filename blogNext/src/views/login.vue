<template>
  <div id="login">
    <el-card class="animated fadeInDown">
      <h1 style="color: #808080; margin: 5rem 0; font-size: 3rem">
        Blog
        <span style="color: #378de5">Dashboard</span>
      </h1>
      <div>
        <el-input placeholder="请输入用户名" v-model="admin_name" clearable></el-input>
        <p style="margin-top: 10px"></p>
        <el-input placeholder="请输入密码" v-model="admin_passwd" show-password></el-input>
        <span slot="footer" class="dialog-footer">
          <br />
          <el-button type="primary" @click="loginto" style="margin: 2rem 0">登 录</el-button>
        </span>
      </div>
    </el-card>
  </div>
</template>
<script>
import api_dash from '@/api/dashboard'
import { setToken } from "@/store/store";

export default {
  name: 'login',
  data() {
    return {
      admin_name: '',
      admin_passwd: '',
    }
  },
  methods: {
    loginto() {
      if (this.admin_name === '' || this.admin_passwd === '') {
        this.login = false
        this.$message('输入的用户名或密码为空')
      } else {
        this.$http
          .post(api_dash.login, { name: this.admin_name, passwd: this.admin_passwd })
          .then((res) => {
            if (res.data.data !== 'failed') {
              setToken(res.data.data)
              this.$router.push('/dashboard')
            } else {
              this.$message.error('登录失败')
            }
          })
          .catch((e) => {
            this.$message.error('登录失败')
          })
      }
    },
  },
}
</script>
<style scoped>
#login {
  max-width: 640px;
  padding: 5rem 1rem;
  margin: 0 auto;
}
#login /deep/ .el-card {
  border: none;
  background-color: var(--body-second-background);
}
</style>
