<template>
  <div class="favorite-problems">
    <div v-if="!favorites || favorites.length === 0" class="empty-state">
      <el-empty description="暂无收藏的题目" :image-size="80" />
    </div>
    <div v-else class="favorites-list">
      <div 
        v-for="item in favorites" 
        :key="item.problemId"
        class="favorite-item"
        @click="$router.push('/problem/' + item.problemId)"
      >
        <div class="problem-info">
          <h4>{{ item.title }}</h4>
          <div class="meta">
            <el-tag :type="getDifficultyType(item.difficulty)" size="small">
              {{ getDifficultyText(item.difficulty) }}
            </el-tag>
            <span class="time">收藏于 {{ formatTime(item.collectTime) }}</span>
          </div>
        </div>
        <el-icon class="arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  favorites: {
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
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.empty-state {
  padding: 40px 0;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
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

.favorite-item:hover {
  background: #fff7e6;
  border-color: #faad14;
  transform: translateX(4px);
}

.problem-info h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #faad14;
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

.favorite-item:hover .arrow {
  color: #faad14;
}
</style>