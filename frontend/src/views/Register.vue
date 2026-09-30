<template>
  <div class="register">
    <div class="register-box">
      <h2>用户注册</h2>
      
      <!-- 验证成功状态 -->
      <div v-if="verified" class="success-box">
        <el-icon style="font-size: 48px; color: #67C23A">
          <SuccessFilled />
        </el-icon>
        <p style="margin-top: 20px; color: #666">注册成功！</p>
        <p style="margin-top: 10px; color: #999">您的账号已创建</p>
        <p style="margin-top: 10px; color: #409EFF">
          <span>{{ countdown }}</span> 秒后自动跳转到登录页面...
        </p>
        <el-button type="primary" style="margin-top: 20px" @click="goToLogin">
          立即登录
        </el-button>
      </div>

      <!-- 验证失败状态 -->
      <div v-else-if="verifyFailed" class="error-box">
        <el-icon style="font-size: 48px; color: #F56C6C">
          <CircleCloseFilled />
        </el-icon>
        <p style="margin-top: 20px; color: #666">验证失败</p>
        <p style="margin-top: 10px; color: #999">{{ errorMessage }}</p>
        <el-button type="primary" style="margin-top: 20px" @click="resetForm">
          重新注册
        </el-button>
      </div>

      <!-- 发送邮件后等待验证状态 -->
      <div v-else-if="emailSent">
        <el-alert
          title="验证邮件已发送"
          type="success"
          description="请查收邮件并点击验证链接完成注册"
          show-icon
          style="margin-bottom: 20px"
        />
        <p style="text-align: center; color: #666">
          邮件可能需要几分钟才能收到，请耐心等待
        </p>
        <p style="text-align: center; margin-top: 20px">
          <el-button type="text" @click="resendEmail" :loading="resending">
            重新发送验证邮件
          </el-button>
        </p>
      </div>

      <!-- 注册表单 -->
      <div v-else>
        <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入北京交通大学邮箱（@bjtu.edu.cn）" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="registerForm.nickname" placeholder="请输入昵称（可选）" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="handleSendEmail" :loading="loading">
              发送验证邮件
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-form-item style="margin-top: 20px">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sendVerificationEmail, checkVerificationStatus } from '@/api/user'
import { ElMessage } from 'element-plus'
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const registerFormRef = ref(null)
const loading = ref(false)
const resending = ref(false)
const emailSent = ref(false)
const verified = ref(false)
const verifyFailed = ref(false)
const errorMessage = ref('')
const countdown = ref(3)
const currentEmail = ref('')
let timer = null
let pollTimer = null

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error('请输入有效的邮箱地址'))
  } else if (!value.endsWith('@bjtu.edu.cn')) {
    callback(new Error('仅允许北京交通大学邮箱注册（@bjtu.edu.cn）'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ]
}

const startPolling = () => {
  pollTimer = setInterval(async () => {
    try {
      const res = await checkVerificationStatus(currentEmail.value)
      if (res.data.verified) {
        stopPolling()
        verified.value = true
        emailSent.value = false
        startCountdown()
      } else if (res.data.message && !res.data.message.includes('等待验证')) {
        stopPolling()
        verifyFailed.value = true
        errorMessage.value = res.data.message
      }
    } catch (e) {
      console.error('检查验证状态失败', e)
    }
  }, 2000)
}

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

const handleSendEmail = async () => {
  await registerFormRef.value.validate()
  loading.value = true
  try {
    await sendVerificationEmail({
      username: registerForm.value.username,
      password: registerForm.value.password,
      email: registerForm.value.email,
      nickname: registerForm.value.nickname
    })
    currentEmail.value = registerForm.value.email
    emailSent.value = true
    ElMessage.success('验证邮件已发送，请查收')
    startPolling()
  } catch (e) {
    ElMessage.error(e.response?.data?.message || '发送失败')
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  resending.value = true
  try {
    await sendVerificationEmail({
      username: registerForm.value.username,
      password: registerForm.value.password,
      email: registerForm.value.email,
      nickname: registerForm.value.nickname
    })
    ElMessage.success('验证邮件已重新发送')
  } catch (e) {
    ElMessage.error(e.response?.data?.message || '发送失败')
  } finally {
    resending.value = false
  }
}

const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/login')
    }
  }, 1000)
}

const goToLogin = () => {
  if (timer) {
    clearInterval(timer)
  }
  router.push('/login')
}

const resetForm = () => {
  verifyFailed.value = false
  errorMessage.value = ''
  emailSent.value = false
  registerForm.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: ''
  }
  stopPolling()
}

onMounted(() => {
})

onUnmounted(() => {
  stopPolling()
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.register-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.success-box, .error-box {
  text-align: center;
}
</style>
