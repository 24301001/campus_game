<template>
  <div class="user-discussions">
    <div v-if="!comments || comments.length === 0" class="empty-state">
      <el-empty description="暂无讨论记录" :image-size="80" />
    </div>
    <div v-else class="discussions-list">
      <div 
        v-for="item in comments" 
        :key="item.noteId"
        class="discussion-item"
      >
        <div class="comment-content-wrapper">
          <p class="comment-text">{{ item.content }}</p>
          <div class="comment-meta">
            <span class="likes">
              <el-icon><Star /></el-icon>
              {{ item.likeCount || 0 }}
            </span>
            <span class="time">{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <div class="problem-link" @click="$router.push('/problem/' + item.problemId)">
          <el-tag size="small">{{ item.problemTitle || '题目' }}</el-tag>
          <el-icon><Link /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.empty-state {
  padding: 40px 0;
}

.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.discussion-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  gap: 16px;
}

.comment-content-wrapper {
  flex: 1;
}

.comment-text {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.likes {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #faad14;
}

.problem-link {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #1890ff;
  transition: all 0.25s;
  flex-shrink: 0;
}

.problem-link:hover {
  color: #40a9ff;
  transform: translateX(4px);
}
</style>