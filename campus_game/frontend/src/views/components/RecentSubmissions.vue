<template>
  <div class="recent-submissions">
    <div v-if="!submissions || submissions.length === 0" class="empty-state">
      <el-empty description="暂无通过的题目" :image-size="80" />
    </div>
    <div v-else class="submissions-list">
      <div 
        v-for="item in submissions" 
        :key="item.problemId"
        class="submission-item"
        @click="$router.push('/problem/' + item.problemId)"
      >
        <div class="problem-info">
          <h4>{{ item.title }}</h4>
          <div class="meta">
            <el-tag :type="getDifficultyType(item.difficulty)" size="small">
              {{ getDifficultyText(item.difficulty) }}
            </el-tag>
            <span class="time">{{ formatTime(item.submitTime) }}</span>
          </div>
        </div>
        <el-icon class="arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  submissions: {
    type: Array,
    default: () => []
  }
})

const getDifficultyType = (difficulty) => {
  const map = { EASY: 'success', MEDIUM: 'warning', HARD: 'danger' }
  return map[difficulty] || 'info'
}

const getDifficultyText = (difficulty) => {
  const map = { EASY: '简单', MEDIUM: '中等', HARD: '困难' }
  return map[difficulty] || difficulty
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.empty-state {
  padding: 40px 0;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.submission-item:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  transform: translateX(4px);
}

.problem-info h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #1890ff;
  font-weight: 500;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time {
  font-size: 13px;
  color: #999;
}

.arrow {
  color: #ccc;
  transition: color 0.25s;
}

.submission-item:hover .arrow {
  color: #1890ff;
}
</style>