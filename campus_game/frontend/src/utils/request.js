import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { ensureAgentTicket } from '@/utils/lobbyAuth'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  paramsSerializer: {
    serialize: params => {
      const parts = []
      for (const key in params) {
        const value = params[key]
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(val => {
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            })
          } else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        }
      }
      return parts.join('&')
    }
  }
})

request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  async response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      if (res.code === 401) {
        if (!response.config.__lobbyRetry && await ensureAgentTicket()) {
          return request({ ...response.config, __lobbyRetry: true })
        }
        const userStore = useUserStore()
        userStore.logout()
        window.top.location.assign('/')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  async error => {
    if (error.response?.status === 401) {
      if (!error.config?.__lobbyRetry && await ensureAgentTicket()) {
        return request({ ...error.config, __lobbyRetry: true })
      }
      useUserStore().logout()
      window.top.location.assign('/')
    }
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request
