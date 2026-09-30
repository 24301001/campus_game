<template>
  <div class="profile-page">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="logo" @click="$router.push('/home')">
            <el-icon><Edit /></el-icon>
            <span>在线编程刷题系统</span>
          </div>
          <div class="nav">
            <el-button @click="$router.push('/home')">首页</el-button>
            <el-button @click="$router.push('/problems')">题库</el-button>
            <template v-if="userStore.user">
              <el-button v-if="userStore.user.role === 'ADMIN'" @click="$router.push('/admin/dashboard')">管理后台</el-button>
              <el-button type="danger" @click="handleLogout">退出</el-button>
            </template>
            <template v-else>
              <el-button type="primary" @click="$router.push('/login')">登录</el-button>
            </template>
          </div>
        </div>
      </el-header>

      <el-main class="main-content">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>
        
        <div v-else-if="!profileData" class="error-container">
          <el-empty description="用户不存在或加载失败" />
        </div>

        <div v-else class="profile-container">
          <!-- 左侧用户信息卡片 -->
          <div class="left-sidebar">
            <div class="user-card">
              <div class="avatar-section">
                <div class="avatar-wrapper" @click="previewAvatar">
                  <el-avatar :size="100" :src="profileData.avatar || defaultAvatar" class="avatar-clickable" />
                  <div class="avatar-overlay" v-if="isOwnProfile">
                    <el-icon><View /></el-icon>
                    <span>查看</span>
                  </div>
                </div>
                <div class="user-basic-info">
                  <h2>{{ profileData.nickname || profileData.username }}</h2>
                  <p class="username">@{{ profileData.username }}</p>
                </div>
              </div>
              
              <div class="bio-section" v-if="profileData.bio">
                <p>{{ profileData.bio }}</p>
              </div>

              <div class="action-buttons">
                <el-button 
                  v-if="isOtherUser"
                  :type="profileData.isFollowing ? 'default' : 'primary'"
                  @click="handleFollow"
                  size="large"
                >
                  {{ profileData.isFollowing ? '已关注' : '+ 关注' }}
                </el-button>
                <el-button 
                  v-if="isOwnProfile"
                  type="primary"
                  @click="showSettingsDialog = true"
                  size="large"
                >
                  <el-icon><Setting /></el-icon>
                  个人设置
                </el-button>
              </div>

              <div class="stats-grid">
                <div class="stat-item" @click="showRankings = true">
                  <div class="stat-value">#{{ profileData.rank || '-' }}</div>
                  <div class="stat-label">排名</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ profileData.followersCount || 0 }}</div>
                  <div class="stat-label">关注者</div>
                </div>
              </div>

              <div class="info-list">
                <div class="info-item">
                  <el-icon><Male v-if="profileData.gender === '男'" /><Female v-else /></el-icon>
                  <span>{{ profileData.gender || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ profileData.ipAddress || '未知位置' }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>加入时间：{{ formatDate(profileData.createTime) }}</span>
                </div>
              </div>

              <div class="achievement-section">
                <h4>成就贡献</h4>
                <div class="achievement-items">
                  <div class="achievement-item">
                    <el-icon :size="20"><View /></el-icon>
                    <span>阅读题目</span>
                    <strong>{{ profileData.viewCount || 0 }}</strong>
                  </div>
                  <div class="achievement-item">
                    <el-icon :size="20"><Star /></el-icon>
                    <span>获得点赞</span>
                    <strong>{{ profileData.likeCount || 0 }}</strong>
                  </div>
                </div>
              </div>

              <AchievementBadges :badges="profileData.badges" />
            </div>
          </div>

          <!-- 右侧主要内容区 -->
          <div class="right-content">
            <!-- 统计概览 -->
            <div class="stats-overview">
              <div class="problem-stats-card">
                <ProblemStatsCircle :data="profileData" />
              </div>
              <div class="difficulty-breakdown">
                <DifficultyBreakdown :data="profileData" />
              </div>
            </div>

            <!-- 技能雷达图 -->
            <div class="skill-radar-section">
              <SkillRadarChart :categoryStats="profileData.categoryStats" />
            </div>

            <!-- 年度提交热力图 -->
            <div class="activity-calendar-section">
              <ActivityCalendar :data="profileData.yearlyActivity" />
            </div>

            <!-- 标签页 -->
            <div class="tabs-section">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="最近通过" name="recent">
                  <RecentSubmissions :submissions="profileData.recentSubmissions" />
                </el-tab-pane>
                <el-tab-pane label="收藏题目" name="favorites">
                  <FavoriteProblems :favorites="profileData.favoriteProblems" />
                </el-tab-pane>
                <el-tab-pane label="讨论" name="discussions">
                  <UserDiscussions :comments="profileData.comments" />
                </el-tab-pane>
                <el-tab-pane v-if="isOwnProfile" label="错题本" name="wrong">
                  <div v-if="wrongProblems.length" class="wrong-list">
                    <div
                      v-for="item in wrongProblems"
                      :key="item.id"
                      class="wrong-row"
                      @click="goProblem(item.id)"
                    >
                      <div class="wrong-main">
                        <span class="wrong-id">#{{ item.id }}</span>
                        <span class="wrong-title">{{ item.title }}</span>
                        <span class="wrong-diff" :class="item.difficulty">{{ difficultyCn(item.difficulty) }}</span>
                        <span v-if="item.category" class="wrong-cat">{{ item.category }}</span>
                      </div>
                      <div class="wrong-side">
                        <span class="wrong-fail">栽了 {{ item.failCount }} 次</span>
                        <el-button size="small" text type="primary" @click.stop="goProblem(item.id)">去重做</el-button>
                      </div>
                    </div>
                  </div>
                  <el-empty v-else description="错题本是空的——交过的都过了" :image-size="80" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>

    <!-- 排名弹窗 -->
    <el-dialog v-model="showRankings" title="用户排行榜" width="800px" top="5vh">
      <UserRankings @close="showRankings = false" />
    </el-dialog>

    <!-- 头像预览弹窗 -->
    <el-dialog v-model="previewVisible" title="头像预览" width="400px" center>
      <div class="avatar-preview-container">
        <img :src="profileData?.avatar || defaultAvatar" alt="头像预览" class="avatar-preview" />
      </div>
      <template #footer>
        <el-button v-if="isOwnProfile" type="primary" @click="showSettingsDialog = true; previewVisible = false">更换头像</el-button>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 个人设置弹窗 -->
    <el-dialog v-model="showSettingsDialog" title="个人设置" width="600px">
      <el-card style="margin-bottom: 20px">
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
          </div>
        </template>
        <el-form :model="userForm" label-width="80px">
          <el-form-item label="头像">
            <div class="avatar-upload">
              <div class="avatar-wrapper" @click="previewSettingsAvatar">
                <el-avatar :size="120" :src="userForm.avatar || defaultAvatar" class="avatar-clickable" />
                <div class="avatar-overlay">
                  <el-icon><View /></el-icon>
                  <span>查看</span>
                </div>
              </div>
              <div class="upload-actions">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="handleUploadAvatar"
                >
                  <el-button type="primary" size="small">
                    <el-icon><Upload /></el-icon>
                    更换头像
                  </el-button>
                </el-upload>
                <el-button type="default" size="small" @click="resetAvatar" v-if="userForm.avatar">
                  <el-icon><Delete /></el-icon>
                  恢复默认
                </el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userForm.username" disabled />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userForm.nickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span>修改密码</span>
          </div>
        </template>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 头像预览弹窗（设置页面） -->
    <el-dialog v-model="settingsAvatarPreviewVisible" title="头像预览" width="400px" center>
      <div class="avatar-preview-container">
        <img :src="userForm.avatar || defaultAvatar" alt="头像预览" class="avatar-preview" />
      </div>
      <template #footer>
        <el-upload
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUploadAvatar"
        >
          <el-button type="primary">更换头像</el-button>
        </el-upload>
        <el-button @click="settingsAvatarPreviewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile, followUser } from '@/api/profile'
import { getWrongProblems } from '@/api/agent'
import { updateUser, updatePassword, uploadAvatar as uploadAvatarApi } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProblemStatsCircle from './components/ProblemStatsCircle.vue'
import DifficultyBreakdown from './components/DifficultyBreakdown.vue'
import SkillRadarChart from './components/SkillRadarChart.vue'
import ActivityCalendar from './components/ActivityCalendar.vue'
import RecentSubmissions from './components/RecentSubmissions.vue'
import FavoriteProblems from './components/FavoriteProblems.vue'
import UserDiscussions from './components/UserDiscussions.vue'
import UserRankings from './components/UserRankings.vue'
import AchievementBadges from './components/AchievementBadges.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const profileData = ref(null)
const activeTab = ref('recent')
/** 错题本：当前账号交过、一直没 AC 的题（只有看自己主页才有） */
const wrongProblems = ref([])
const showRankings = ref(false)
const previewVisible = ref(false)
const showSettingsDialog = ref(false)
const settingsAvatarPreviewVisible = ref(false)
const passwordFormRef = ref(null)

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const userForm = ref({
  username: '',
  nickname: '',
  email: '',
  avatar: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const targetUserId = computed(() => {
  return route.params.id || userStore.user?.id
})

const isOtherUser = computed(() => {
  return userStore.user && targetUserId.value !== userStore.user.id
})

const isOwnProfile = computed(() => {
  return !isOtherUser.value
})

const previewAvatar = () => {
  previewVisible.value = true
}

const difficultyCn = (difficulty) => ({ EASY: '简单', MEDIUM: '中等', HARD: '困难' }[difficulty] || '未知')

/** 错题本里的一行 → 直接进题目页重做 */
const goProblem = (id) => {
  router.push(`/problem/${id}`)
}

const loadWrongProblems = async () => {
  try {
    const res = await getWrongProblems()
    wrongProblems.value = res.data || []
  } catch (e) {
    wrongProblems.value = []
  }
}

const loadProfile = async () => {
  if (!targetUserId.value) {
    console.error('No user ID available')
    ElMessage.error('无法获取用户ID，请先登录')
    loading.value = false
    return
  }
  
  loading.value = true
  try {
    console.log('Loading profile for user ID:', targetUserId.value)
    const res = await getUserProfile(targetUserId.value)
    console.log('Profile response:', res)
    if (res.code === 200) {
      profileData.value = res.data
      // 如果是查看自己的资料，加载用户表单和错题本
      if (isOwnProfile.value) {
        loadUserInfo()
        loadWrongProblems()
      }
    } else {
      ElMessage.error(res.message || '加载用户信息失败')
    }
  } catch (e) {
    console.error('Error loading profile:', e)
    if (e.response) {
      console.error('Response status:', e.response.status)
      console.error('Response data:', e.response.data)
      ElMessage.error(`请求失败: ${e.response.status} - ${e.response.data?.message || e.message}`)
    } else {
      ElMessage.error(e.message || '加载用户信息失败')
    }
  } finally {
    loading.value = false
  }
}

const loadUserInfo = async () => {
  try {
    const res = await userStore.fetchUserInfo()
    userForm.value = {
      username: res.data.username,
      nickname: res.data.nickname,
      email: res.data.email,
      avatar: res.data.avatar
    }
  } catch (e) {
  }
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }
  return true
}

const handleUploadAvatar = async (options) => {
  try {
    const res = await uploadAvatarApi(options.file)
    if (res.code === 200) {
      userForm.value.avatar = res.data.url
      // 保存到后端
      await updateUser(userForm.value)
      await userStore.fetchUserInfo()
      // 更新页面显示
      profileData.value.avatar = res.data.url
      ElMessage.success('头像上传成功!')
    } else {
      ElMessage.error(res.message || '头像上传失败')
    }
  } catch (e) {
    ElMessage.error('头像上传失败')
  }
}

const previewSettingsAvatar = () => {
  settingsAvatarPreviewVisible.value = true
}

const resetAvatar = async () => {
  try {
    await ElMessageBox.confirm('确定要恢复默认头像吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userForm.value.avatar = ''
    await updateUser(userForm.value)
    await userStore.fetchUserInfo()
    // 更新页面显示
    profileData.value.avatar = ''
    ElMessage.success('已恢复默认头像')
  } catch {
  }
}

const saveUserInfo = async () => {
  try {
    await updateUser(userForm.value)
    await userStore.fetchUserInfo()
    // 更新页面显示
    profileData.value.nickname = userForm.value.nickname
    profileData.value.email = userForm.value.email
    ElMessage.success('保存成功')
  } catch (e) {
  }
}

const savePassword = async () => {
  await passwordFormRef.value.validate()
  try {
    await updatePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    ElMessage.success('修改成功')
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (e) {
  }
}

const handleFollow = async () => {
  try {
    const res = await followUser(targetUserId.value)
    ElMessage.success(res.msg || (profileData.value.isFollowing ? '取消关注成功' : '关注成功'))
    profileData.value.isFollowing = !profileData.value.isFollowing
    if (profileData.value.isFollowing) {
      profileData.value.followersCount++
    } else {
      profileData.value.followersCount--
    }
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/home')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return '-'
  // 加入时间精确到天：对话里能把加入时间设到某一天，这里就得显示到天
  const pad = (n) => String(n).padStart(2, '0')
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
}

onMounted(async () => {
  await loadProfile()
  // 算法哥把你带过来时会带上参数：?tab=favorites 直接翻到收藏，
  // ?settings=1 直接把个人设置弹出来（原来的侧边栏版个人中心已删掉）。
  const tab = String(route.query.tab || '')
  if (['recent', 'favorites', 'discussions', 'wrong'].includes(tab)) {
    activeTab.value = tab
  }
  if (route.query.settings) {
    showSettingsDialog.value = true
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.nav {
  display: flex;
  gap: 8px;
}

.main-content {
  max-width: 1400px;
  margin: 20px auto;
  width: 100%;
  padding: 0 20px;
}

.loading-container,
.error-container {
  background: white;
  border-radius: 8px;
  padding: 40px;
}

.profile-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.left-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 80px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.avatar-clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-wrapper:hover .avatar-clickable {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.avatar-preview-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.avatar-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.user-basic-info h2 {
  margin: 12px 0 4px 0;
  font-size: 22px;
  color: #1a1a1a;
}

.username {
  color: #999;
  font-size: 14px;
}

.bio-section {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: center;
}

.bio-section p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-bottom: 20px;
  padding: 16px 40px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.info-list {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #666;
  font-size: 14px;
}

.info-item .el-icon {
  color: #999;
}

.achievement-section h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #333;
}

.achievement-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.achievement-item span {
  flex: 1;
  color: #666;
  font-size: 14px;
}

.achievement-item strong {
  color: #1890ff;
  font-size: 16px;
}

.right-content {
  flex: 1;
  min-width: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.problem-stats-card,
.difficulty-breakdown,
.skill-radar-section,
.activity-calendar-section,
.tabs-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

/* ---------------- 错题本 ---------------- */
.wrong-list {
  display: flex;
  flex-direction: column;
}

.wrong-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.15s ease;
}

.wrong-row:hover {
  background: #f7f9fc;
}

.wrong-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.wrong-id {
  font-family: ui-monospace, monospace;
  color: #9aa4b2;
  font-size: 12px;
}

.wrong-title {
  font-weight: 600;
  color: #2c3e50;
}

.wrong-diff {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 999px;
}

.wrong-diff.EASY {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.12);
}

.wrong-diff.MEDIUM {
  color: #d97706;
  background: rgba(217, 119, 6, 0.12);
}

.wrong-diff.HARD {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.12);
}

.wrong-cat {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 8px;
  border-radius: 999px;
}

.wrong-side {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.wrong-fail {
  font-size: 12px;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  padding: 1px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.avatar-upload {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
