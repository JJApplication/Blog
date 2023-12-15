import customData from '../custom/custom'
import { Message } from 'element-ui'
import router from '../router'
import axios from 'axios'
import { getToken, rmToken } from "@/store/store";

const request = axios.create({
  baseURL: customData.api_url,
  withCredentials: false,
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.admin_token = token
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    if (response.status === 403) {
      console.log('无权限访问接口')
      Message.error('无权限访问接口')
      rmToken()
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
    return response
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === '401') {
      Message.error('无权限查看私密文章')
      setTimeout(() => {
        router.back()
      }, 1500)
      return
    }
    if (error.response && error.response.status && error.response.status === 403) {
      console.log('无权限访问接口')
      Message.error('无权限访问接口')
      rmToken()
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  },
)
export default request
