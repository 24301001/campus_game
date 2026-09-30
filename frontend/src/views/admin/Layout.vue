<template>
  <el-container class="admin-layout">
    <el-aside width="250px">
      <div class="aside-header">
        <div class="logo" @click="$router.push('/home')">
          <el-icon><Edit /></el-icon>
          <span>管理后台</span>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/problems">
          <el-icon><Document /></el-icon>
          <span>题目管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/submissions">
          <el-icon><List /></el-icon>
          <span>提交记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <span>{{ userStore.user?.nickname || userStore.user?.username }}</span>
          <el-button type="danger" @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/home')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
}

.aside-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #263445;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.el-header {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
