<template>
  <div class="verify-email">
    <div class="verify-box">
      <h2>邮箱验证</h2>
      <div v-if="verifying">
        <el-icon class="is-loading" style="font-size: 48px; color: #409EFF"></el-icon>
        <p style="margin-top: 20px; color: #666">正在验证...</p>
      </div>
      <div v-else-if="verified">
        <el-icon style="font-size: 48px; color: #67C23A">
          <SuccessFilled />
        </el-icon>
        <p style="margin-top: 20px; color: #666">验证成功！</p>
        <p style="margin-top: 10px; color: #999">您的账号已成功注册</p>
        <p style="margin-top: 10px; color: #409EFF">
          <span>{{ countdown }}</span> 秒后自动关闭...
        </p>
      </div>
      <div v-else>
        <el-icon style="font-size: 48px; color: #F56C6C">
          <CircleCloseFilled />
        </el-icon>
        <p style="margin-top: 20px; color: #666">验证失败</p>
        <p style="margin-top: 10px; color: #999">{{ errorMessage }}</p>
        <el-button type="primary" style="margin-top: 20px" @click="goToRegister">
          重新注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { verifyEmail } from '@/api/user'
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const verifying = ref(true)
const verified = ref(false)
const errorMessage = ref('')
const countdown = ref(3)
let timer = null

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    verifying.value = false
    errorMessage.value = '验证链接无效'
    return
  }

  try {
    await verifyEmail({ code })
    verified.value = true
    verifying.value = false
    startCountdown()
  } catch (e) {
    verifying.value = false
    errorMessage.value = e.response?.data?.message || '验证失败'
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      window.close()
    }
  }, 1000)
}

const goToRegister = () => {
  window.close()
}
</script>

<style scoped>
.verify-email {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.verify-box {
  background: white;
  padding: 60px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.verify-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>
