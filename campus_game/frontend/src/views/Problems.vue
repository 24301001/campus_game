<template>
  <div class="problems">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="logo" @click="$router.push('/home')">
            <el-icon><Edit /></el-icon>
            <span class="site-name">CodeHub</span>
          </div>
          <div class="nav">
            <el-button text @click="$router.push('/home')">探索</el-button>
            <el-button text type="primary" class="active-nav">题库</el-button>
            <template v-if="userStore.user">
              <el-button text @click="$router.push('/profile')">个人中心</el-button>
              <el-button text v-if="userStore.user.role === 'ADMIN'" @click="$router.push('/admin/dashboard')">管理</el-button>
              <el-button text @click="handleLogout">退出</el-button>
            </template>
            <template v-else>
              <el-button text type="primary" @click="$router.push('/login')">登录</el-button>
            </template>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="problems-container">
          <!-- 左侧主内容 -->
          <div class="main-content">
            <!-- 分类标签栏 -->
            <div class="category-tags-section">
              <div class="category-tags-container">
                <span v-for="category in visibleCategories" :key="category.id" :class="['category-tag', { active: filters.categoryId === category.id }]" @click="filterByCategory(category.id)">
                  {{ category.name }}
                  <span class="category-count">{{ category.problemCount }}</span>
                </span>
                <span class="expand-btn" @click="toggleExpand">
                  {{ isExpanded ? '收起' : '展开' }}
                  <el-icon v-if="isExpanded"><ArrowUp /></el-icon>
                  <el-icon v-else><ArrowDown /></el-icon>
                </span>
              </div>
            </div>

            <!-- 搜索和筛选 -->
            <div class="search-filter-section">
              <div class="search-bar">
                <el-input v-model="filters.keyword" placeholder="搜索题目..." clearable @keyup.enter="loadProblems" class="search-input">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button @click="toggleSort">
                  <el-icon :class="{ 'sort-asc': sortAsc }">
                    <Sort />
                  </el-icon>
                </el-button>
                <el-button :type="showFilter ? 'primary' : 'default'" @click="showFilter = !showFilter">
                  <el-icon><Filter /></el-icon>
                </el-button>
              </div>

              <!-- 高级筛选弹窗 -->
              <el-drawer v-model="showFilter" title="筛选条件" size="30%" :with-header="false">
                <div class="filter-form">
                  <div class="filter-group">
                    <label>匹配方式</label>
                    <el-select v-model="filterMatch" class="filter-select">
                      <el-option label="所有" value="all" />
                      <el-option label="任意" value="any" />
                    </el-select>
                  </div>

                  <div class="filter-group">
                    <label>状态</label>
                    <el-select v-model="filterStatus" class="filter-select">
                      <el-option label="全部" value="" />
                      <el-option label="已解答" value="solved" />
                      <el-option label="未解答" value="unsolved" />
                    </el-select>
                  </div>

                  <div class="filter-group">
                    <label>难度</label>
                    <el-select v-model="filters.difficulty" class="filter-select" @change="loadProblems">
                      <el-option label="全部" value="" />
                      <el-option label="简单" value="EASY" />
                      <el-option label="中等" value="MEDIUM" />
                      <el-option label="困难" value="HARD" />
                    </el-select>
                  </div>

                  <div class="filter-group">
                    <label>知识点</label>
                    <el-select v-model="filters.tagIds" multiple class="filter-select" @change="loadProblems">
                      <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
                    </el-select>
                  </div>

                  <div class="filter-actions">
                    <el-button type="primary" @click="showFilter = false">应用筛选</el-button>
                    <el-button @click="resetFilters">重置</el-button>
                  </div>
                </div>
              </el-drawer>
            </div>

            <!-- 按企业看题时，给个能一眼看到、随手取消的提示 -->
            <div v-if="activeCompany" class="filter-chip-bar">
              <span class="filter-chip">
                <el-icon><OfficeBuilding /></el-icon>
                <span>{{ activeCompany.name }}的企业题库 · 共 {{ total }} 题</span>
                <el-icon class="chip-close" @click="clearCompany"><Close /></el-icon>
              </span>
            </div>

            <div class="problems-table-wrapper">
              <el-table :data="problems" style="width: 100%" class="problems-table" :header-cell-style="{
                background: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
                color: '#2c3e50',
                fontWeight: 600
              }">
                <el-table-column prop="id" label="编号" width="80">
                  <template #default="{ row }">
                    <span class="problem-id">{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="题目标题" min-width="350">
                  <template #default="{ row }">
                    <div class="problem-title-cell">
                      <el-link type="primary" @click="$router.push(`/problem/${row.id}`)" class="problem-title">
                        {{ row.title }}
                      </el-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="difficulty" label="难度" width="110">
                  <template #default="{ row }">
                    <span v-if="row.difficulty === 'EASY'" class="difficulty easy">简单</span>
                    <span v-else-if="row.difficulty === 'MEDIUM'" class="difficulty medium">中等</span>
                    <span v-else class="difficulty hard">困难</span>
                  </template>
                </el-table-column>
                <el-table-column label="标签" min-width="250">
                  <template #default="{ row }">
                    <div class="tags-container">
                      <span v-for="tag in row.tags" :key="tag.id" class="problem-tag">
                        {{ tag.name }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="企业" min-width="180">
                  <template #default="{ row }">
                    <div class="company-cell">
                      <span v-for="c in (row.companies || []).slice(0, 2)" :key="c.id" class="company-tag">
                        {{ c.name }}
                      </span>
                      <span v-if="(row.companies || []).length > 2" class="company-more">
                        +{{ row.companies.length - 2 }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="通过率" width="120">
                  <template #default="{ row }">
                    <div class="acceptance-rate">
                      <div class="rate-bar">
                        <div class="rate-fill" :style="{ width: getRateWidth(row) + '%' }"></div>
                      </div>
                      <span>{{ getRate(row) }}%</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination-wrapper">
              <el-pagination
                :current-page="pageNum"
                :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                class="pagination"
              />
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="sidebar">
            <!-- 每日做题模块 -->
            <div class="sidebar-card">
              <div class="card-header">
                <el-icon><Calendar /></el-icon>
                <span>每日做题</span>
                <div class="month-nav">
                  <el-button text size="small" @click="prevMonth">
                    <el-icon><ArrowLeft /></el-icon>
                  </el-button>
                  <span class="month-text">{{ currentMonth }}</span>
                  <el-button text size="small" @click="nextMonth">
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="calendar-header-today">
                <span class="today-date">{{ todayDate }}</span>
              </div>
              <div class="calendar-container">
                <div class="calendar-header">
                  <span v-for="day in weekDays" :key="day" class="calendar-weekday">
                    {{ day }}
                  </span>
                </div>
                <div class="calendar-grid">
                  <span v-for="date in calendarDates" :key="date.day" :class="['calendar-day', getCalendarDayClass(date)]" @click="markTodayCompleted(date)">
                    {{ date.day }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 热门企业题库 -->
            <div class="sidebar-card">
              <div class="card-header">
                <el-icon><OfficeBuilding /></el-icon>
                <span>热门企业题库</span>
              </div>
              <div class="search-box">
                <el-input v-model="companySearch" placeholder="输入企业名称" clearable size="small">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
              <div class="company-list">
                <div v-for="company in filteredCompanies" :key="company.id"
                     class="company-item"
                     :class="{ active: filters.companyId === company.id }"
                     :title="company.description || company.name"
                     @click="filterByCompany(company)">
                  <span class="company-name">{{ company.name }}</span>
                  <span class="company-count">{{ company.problemCount }}</span>
                </div>
                <div v-if="filteredCompanies.length === 0" class="no-result">
                  <span>没有找到相关企业</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { getProblemList } from '@/api/problem'
import { getCategoryList } from '@/api/category'
import { getTagList } from '@/api/tag'
import { getCompanyList } from '@/api/company'
import { getUserProfile } from '@/api/profile'
import { ElMessage } from 'element-plus'
import { Edit, Search, Filter, Sort, ArrowUp, ArrowDown, Calendar, Plus, OfficeBuilding, ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const problems = ref([])
const categories = ref([])
const tags = ref([])
const pageNum = ref(1)
const pageSize = ref(50)
const total = ref(0)

const filters = ref({
  categoryId: null,
  difficulty: '',
  keyword: '',
  tagIds: [],
  companyId: null
})

// 分类标签相关
const isExpanded = ref(false)
const showFilter = ref(false)
const filterMatch = ref('all')
const filterStatus = ref('')
const sortAsc = ref(true)

// 右侧边栏数据：企业题库（来自后端，题目数是真实的关联数）
const companySearch = ref('')
const companies = ref([])

const loadCompanies = async () => {
  try {
    const res = await getCompanyList()
    companies.value = res.data || []
  } catch (e) {
    console.error('获取企业列表失败', e)
  }
}

// 日历数据
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const calendarDates = ref([])
const currentMonth = ref('')
const todayDate = ref('')
const currentYear = ref(2026)
const currentMonthIndex = ref(5) // 0-11，默认6月
const userSubmitDates = ref(new Set()) // 存储用户提交过的日期

// 获取用户提交记录
const loadUserSubmitRecords = async () => {
  if (!userStore.user || !userStore.user.id) return
  
  try {
    const res = await getUserProfile(userStore.user.id)
    if (res.data && res.data.yearlyActivity) {
      // 将后端返回的日期格式化为标准格式
      const dates = res.data.yearlyActivity.map(item => item.date)
      userSubmitDates.value = new Set(dates)
    }
  } catch (e) {
    console.error('获取用户提交记录失败', e)
  }
}

// 初始化日历
const initCalendar = (year = null, month = null) => {
  const today = new Date()
  const displayYear = year !== null ? year : today.getFullYear()
  const displayMonth = month !== null ? month : today.getMonth()
  
  currentYear.value = displayYear
  currentMonthIndex.value = displayMonth
  
  const firstDay = new Date(displayYear, displayMonth, 1)
  const lastDay = new Date(displayYear, displayMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekDay = firstDay.getDay()

  // 设置当前月份
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                      '七月', '八月', '九月', '十月', '十一月', '十二月']
  currentMonth.value = monthNames[displayMonth]
  
  // 设置今天日期
  todayDate.value = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const dates = []
  // 添加上个月的空白日期
  for (let i = 0; i < startWeekDay; i++) {
    dates.push({ day: '', disabled: true })
  }
  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = displayYear === today.getFullYear() && 
                    displayMonth === today.getMonth() && 
                    i === today.getDate()
    
    // 格式化为 yyyy-MM-dd 格式
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    // 检查后端数据中是否有该日期的提交记录
    const isCompleted = userSubmitDates.value.has(dateStr)
    
    dates.push({ 
      day: i, 
      isToday, 
      isCompleted, 
      disabled: false 
    })
  }
  // 添加下个月的空白日期
  const totalCells = Math.ceil((startWeekDay + daysInMonth) / 7) * 7
  while (dates.length < totalCells) {
    dates.push({ day: '', disabled: true })
  }

  calendarDates.value = dates
}

// 标记今日为完成
const markTodayCompleted = (date) => {
  if (!date.isToday) return // 只能标记今天
  
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  
  date.isCompleted = true
  // 保存到本地存储
  localStorage.setItem(`problem_completed_${year}_${month}_${date.day}`, 'true')
}

// 上一个月
const prevMonth = () => {
  let year = currentYear.value
  let month = currentMonthIndex.value - 1
  
  if (month < 0) {
    year--
    month = 11
  }
  
  initCalendar(year, month)
}

// 下一个月
const nextMonth = () => {
  let year = currentYear.value
  let month = currentMonthIndex.value + 1
  
  if (month > 11) {
    year++
    month = 0
  }
  
  initCalendar(year, month)
}

// 监听路由变化，检查是否完成题目
watch(() => router.currentRoute.value, async (to) => {
  // 如果是题目详情页，并且路径包含problem，说明可能完成了题目
  if (to.path.includes('/problem/')) {
    // 重新加载用户提交记录
    await loadUserSubmitRecords()
    // 更新当前日历
    initCalendar(currentYear.value, currentMonthIndex.value)
  }
}, { immediate: false })

// 获取日历日期的样式类
const getCalendarDayClass = (date) => {
  if (date.disabled) return 'disabled'
  if (date.isCompleted) return 'completed'
  if (date.isToday) return 'today'
  return ''
}

// 计算可见的分类
const visibleCategories = computed(() => {
  if (isExpanded.value) {
    return categories.value
  }
  // 默认显示前10个分类
  return categories.value.slice(0, 10)
})

// 计算筛选后的企业列表（中文名、英文名都能搜到）
const filteredCompanies = computed(() => {
  if (!companySearch.value || companySearch.value.trim() === '') {
    return companies.value
  }
  const searchText = companySearch.value.trim().toLowerCase()
  return companies.value.filter(company =>
    company.name.toLowerCase().includes(searchText) ||
    (company.nameEn || '').toLowerCase().includes(searchText)
  )
})

// 当前选中的企业
const activeCompany = computed(() =>
  companies.value.find(company => company.id === filters.value.companyId) || null
)

// 点企业名 → 只看这家公司的题库；再点一次取消
const filterByCompany = (company) => {
  filters.value.companyId = filters.value.companyId === company.id ? null : company.id
  pageNum.value = 1
  loadProblems()
}

const clearCompany = () => {
  filters.value.companyId = null
  pageNum.value = 1
  loadProblems()
}

// 按分类筛选
const filterByCategory = (categoryId) => {
  filters.value.categoryId = filters.value.categoryId === categoryId ? null : categoryId
  pageNum.value = 1
  loadProblems()
}

/** 算法哥说「打开算法题」时会带着 ?category=算法 过来 —— 等价于点那排分类标签 */
const applyCategoryFromQuery = () => {
  const name = String(router.currentRoute.value.query.category || '').trim()
  if (!name) return
  const key = name.replace(/\s+/g, '').toLowerCase()
  const hit = categories.value.find(
    (item) => String(item.name).replace(/\s+/g, '').toLowerCase() === key
  )
  if (!hit) {
    ElMessage.warning(`题库里没有「${name}」这个分类`)
    return
  }
  filters.value.categoryId = hit.id
  isExpanded.value = true          // 展开分类栏，让人一眼看到筛的是哪个
  pageNum.value = 1
  loadProblems()
}

// 已经站在题库页时，算法哥又叫你看另一类 → 跟着换筛选
watch(() => router.currentRoute.value.query.category, (name) => {
  if (name) applyCategoryFromQuery()
})

// 展开/收起分类
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 切换排序
const toggleSort = () => {
  sortAsc.value = !sortAsc.value
  // 这里可以添加排序逻辑
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    categoryId: null,
    difficulty: '',
    keyword: '',
    tagIds: []
  }
  filterMatch.value = 'all'
  filterStatus.value = ''
  pageNum.value = 1
  loadProblems()
  showFilter.value = false
}

const getRate = (row) => {
  return row.submitCount > 0 ? ((row.acceptCount / row.submitCount) * 100).toFixed(1) : '0.0'
}

const getRateWidth = (row) => {
  return row.submitCount > 0 ? Math.min(((row.acceptCount / row.submitCount) * 100), 100) : 0
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadProblems()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadProblems()
}

const loadProblems = async () => {
  try {
    const res = await getProblemList({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      categoryId: filters.value.categoryId,
      difficulty: filters.value.difficulty,
      keyword: filters.value.keyword,
      tagIds: filters.value.tagIds,
      companyId: filters.value.companyId
    })
    problems.value = res.data.records
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data
  } catch (e) {
  }
}

const loadTags = async () => {
  try {
    const res = await getTagList()
    tags.value = res.data
  } catch (e) {
  }
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/home')
}

onMounted(async () => {
  await loadCategories()          // 先拿到分类，才能按名字定位算法哥带过来的 ?category=
  applyCategoryFromQuery()
  loadProblems()
  loadTags()
  loadCompanies()
  
  // 确保用户提交记录加载完成后再初始化日历
  await loadUserSubmitRecords()
  initCalendar()
  
  // 监听题目完成事件
  window.addEventListener('problemCompleted', async (e) => {
    await loadUserSubmitRecords()
    initCalendar(currentYear.value, currentMonthIndex.value)
  })
  
  // 定时刷新提交记录（每30秒）
  setInterval(async () => {
    if (userStore.user && userStore.user.id) {
      await loadUserSubmitRecords()
      initCalendar(currentYear.value, currentMonthIndex.value)
    }
  }, 30000)
})
</script>

<style scoped>
.problems {
  min-height: 100vh;
  background-color: #ffffff;
}

.el-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
  color: #2c3e50;
  padding: 0;
  height: 64px !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
}

.site-name {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav .el-button {
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  color: #6c757d;
}

.nav .el-button:hover {
  color: #2c3e50;
  background-color: #f8f9fa;
}

.active-nav {
  color: #00a1d6 !important;
}

.el-main {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 24px;
}

.problems-container {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧主内容 */
.main-content {
  flex: 1;
  min-width: 0;
}

/* 右侧边栏 */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #2c3e50;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.month-text {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  min-width: 60px;
  text-align: center;
}

.more-btn {
  padding: 4px 8px;
  font-size: 12px;
}

/* 日历模块 */
.calendar-header-today {
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.calendar-container {
  padding: 16px 20px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 12px;
  color: #6c757d;
}

.calendar-weekday {
  padding: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-day.disabled {
  color: #dee2e6;
  cursor: default;
}

.calendar-day.today {
  background-color: #e9ecef;
  color: #2c3e50;
  font-weight: 500;
}

.calendar-day.completed {
  background-color: #27ae60;
  color: white;
  font-weight: 500;
}

.calendar-day:hover:not(.disabled) {
  background-color: #e3f2fd;
  color: #00a1d6;
}

.calendar-footer {
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.plus-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #6c757d;
}

.remaining {
  font-size: 12px;
  color: #f39c12;
  margin-left: auto;
}

.challenge-badges {
  display: flex;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
  color: #6c757d;
}

/* 企业题库模块 */
.search-box {
  padding: 16px 20px;
}

.company-list {
  padding: 0 20px 16px;
  max-height: 300px;
  overflow-y: auto;
}

.company-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.company-item:last-child {
  border-bottom: none;
}

.company-item:hover {
  background-color: #f8f9fa;
}

.company-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 600;
  /* 列表本身有左右内边距，这里负出去让选中底色铺满整行 */
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

/* 当前按企业筛选时的提示条 */
.filter-chip-bar {
  margin-bottom: 12px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 13px;
  color: #409eff;
}

.chip-close {
  cursor: pointer;
  font-size: 13px;
}

.chip-close:hover {
  color: #f56c6c;
}

/* 题目行里的「收录企业」 */
.company-cell {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.company-tag {
  padding: 1px 6px;
  background: #f4f4f5;
  border-radius: 3px;
  font-size: 12px;
  color: #606266;
}

.company-more {
  font-size: 12px;
  color: #909399;
}

.company-name {
  font-size: 14px;
  color: #2c3e50;
}

.company-count {
  padding: 2px 8px;
  background-color: #e9ecef;
  border-radius: 12px;
  font-size: 12px;
  color: #6c757d;
}

.no-result {
  text-align: center;
  padding: 24px 0;
  color: #6c757d;
  font-size: 14px;
}

/* 分类标签栏 */
.category-tags-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.category-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #6c757d;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tag:hover {
  background-color: #e9ecef;
  color: #2c3e50;
}

.category-tag.active {
  background-color: #00a1d6;
  color: white;
}

.category-count {
  background-color: rgba(0, 0, 0, 0.1);
  color: #6c757d;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.category-tag:hover .category-count {
  background-color: rgba(0, 0, 0, 0.2);
}

.category-tag.active .category-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  color: #00a1d6;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.expand-btn:hover {
  background-color: rgba(0, 161, 214, 0.1);
}

/* 搜索和筛选 */
.search-filter-section {
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  border: none;
  box-shadow: none;
}

.search-input .el-input__wrapper {
  border: none;
  box-shadow: none;
}

.search-bar .el-button {
  border-left: 1px solid #e9ecef;
  border-radius: 0;
}

.sort-asc {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.el-icon:not(.sort-asc) {
  transition: transform 0.2s;
}

/* 筛选表单 */
.filter-form {
  padding: 24px;
  height: 100%;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.filter-select {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.problems-table-wrapper {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.problems-table {
  font-size: 14px;
}

.problem-id {
  color: #6c757d;
  font-weight: 500;
}

.problem-title-cell {
  padding: 8px 0;
}

.problem-title {
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
}

.problem-title:hover {
  color: #00a1d6;
}

.difficulty {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
}

.difficulty.easy {
  color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
}

.difficulty.medium {
  color: #f39c12;
  background-color: rgba(243, 156, 18, 0.1);
}

.difficulty.hard {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.tags-container {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.problem-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f8f9fa;
  color: #6c757d;
  border-radius: 3px;
  font-size: 12px;
}

.acceptance-rate {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-bar {
  width: 60px;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.rate-fill {
  background: linear-gradient(90deg, #00a1d6 0%, #00b5e5 100%);
  height: 100%;
  transition: width 0.3s;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.pagination {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>