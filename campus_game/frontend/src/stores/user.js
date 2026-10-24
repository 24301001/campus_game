import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi, getUserInfo } from '@/api/user'
import { reset as resetAgentWatch } from '@/utils/agentWatcher'
import { handExitToHost } from '@/utils/hostAuth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (newUser) => {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  const login = async (loginForm) => {
    const res = await loginApi(loginForm)
    setToken(res.data.token)
    setUser({
      id: res.data.userId,
      username: res.data.username,
      nickname: res.data.nickname,
      role: res.data.role
    })
    return res
  }

  const register = async (registerForm) => {
    return await registerApi(registerForm)
  }

  const logout = (handBack = false) => {
    setToken('')
    setUser(null)
    // 退出时把算法哥的观察状态清干净，别把上一个人的状态带给下一个登录的账号
    resetAgentWatch()
    // ⭐ 只有**用户主动按退出**才交回宿主收抽屉（各视图传 true）。
    //    请求拦截器那条 401 走的是默认 false —— 那是「票过期」，该让宿主静默补票重试，
    //    不是把人踢回大厅（任务书 §9.2 铁律 3 / 风险表第 5 条）。
    if (handBack) handExitToHost()
  }

  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    setUser(res.data)
    return res
  }

  return {
    token,
    user,
    setToken,
    setUser,
    login,
    register,
    logout,
    fetchUserInfo
  }
})
