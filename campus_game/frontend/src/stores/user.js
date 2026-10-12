import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi, getUserInfo } from '@/api/user'
import { reset as resetAgentWatch } from '@/utils/agentWatcher'

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

  const logout = () => {
    setToken('')
    setUser(null)
    // 退出时把算法哥的观察状态清干净，别把上一个人的状态带给下一个登录的账号
    resetAgentWatch()
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
