<template>
  <div class="difficulty-breakdown">
    <h3>难度分布</h3>
    <div class="breakdown-content">
      <div class="difficulty-item easy">
        <div class="difficulty-header">
          <span class="dot"></span>
          <span class="name">简单</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: easyPercentage + '%' }"
          ></div>
        </div>
        <div class="count">{{ data.easyCount || 0 }}</div>
      </div>

      <div class="difficulty-item medium">
        <div class="difficulty-header">
          <span class="dot"></span>
          <span class="name">中等</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: mediumPercentage + '%' }"
          ></div>
        </div>
        <div class="count">{{ data.mediumCount || 0 }}</div>
      </div>

      <div class="difficulty-item hard">
        <div class="difficulty-header">
          <span class="dot"></span>
          <span class="name">困难</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: hardPercentage + '%' }"
          ></div>
        </div>
        <div class="count">{{ data.hardCount || 0 }}</div>
      </div>

      <div class="total-row">
        <span>总计</span>
        <strong>{{ totalCount }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const totalCount = computed(() => {
  return (props.data.easyCount || 0) + (props.data.mediumCount || 0) + (props.data.hardCount || 0)
})

const easyPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((props.data.easyCount || 0) / totalCount.value * 100)
})

const mediumPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((props.data.mediumCount || 0) / totalCount.value * 100)
})

const hardPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((props.data.hardCount || 0) / totalCount.value * 100)
})
</script>

<style scoped>
.difficulty-breakdown h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
}

.breakdown-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.difficulty-item {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.difficulty-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.easy .dot { background: #52c41a; }
.medium .dot { background: #faad14; }
.hard .dot { background: #f5222d; }

.name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.progress-bar {
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
  min-width: 2px;
}

.easy .progress-fill { background: linear-gradient(90deg, #95de64, #52c41a); }
.medium .progress-fill { background: linear-gradient(90deg, #ffc53d, #faad14); }
.hard .progress-fill { background: linear-gradient(90deg, #ff7a45, #f5222d); }

.count {
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.total-row strong {
  font-size: 18px;
  color: #1890ff;
}
</style>