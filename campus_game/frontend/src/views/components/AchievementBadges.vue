<template>
  <div class="badge-section">
    <h4>成就勋章</h4>
    <div class="badge-grid">
      <div 
        v-for="badge in badges" 
        :key="badge.id"
        :class="['badge-card', { 'unlocked': badge.unlocked, 'locked': !badge.unlocked }]"
        @mouseenter="hoveredBadge = badge.id"
        @mouseleave="hoveredBadge = null"
      >
        <div class="badge-icon-wrapper">
          <div class="badge-icon">{{ badge.icon }}</div>
          <div v-if="badge.unlocked" class="badge-glow"></div>
          <div v-if="!badge.unlocked" class="badge-lock-overlay">
            <el-icon :size="20"><Lock /></el-icon>
          </div>
        </div>
        
        <div class="badge-info">
          <div class="badge-name">{{ badge.name }}</div>
          <div class="badge-desc">{{ badge.description }}</div>
          
          <transition name="fade">
            <div v-if="hoveredBadge === badge.id && badge.unlocked && badge.unlockTime" class="badge-time">
              <el-icon><Clock /></el-icon>
              {{ formatTime(badge.unlockTime) }} 获得
            </div>
            <div v-else-if="hoveredBadge === badge.id && !badge.unlocked" class="badge-hint">
              🔒 未达成
            </div>
          </transition>
        </div>
      </div>
      
      <div v-if="!badges || badges.length === 0" class="no-badge">
        暂无成就勋章，继续努力吧！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Lock, Clock } from '@element-plus/icons-vue'

const props = defineProps({
  badges: {
    type: Array,
    default: () => []
  }
})

const hoveredBadge = ref(null)

const formatTime = (time) => {
  if (!time) return ''
  
  if (Array.isArray(time)) {
    const [year, month, day] = time
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  
  if (typeof time === 'string') {
    return time.split('T')[0]
  }
  
  if (time instanceof Date) {
    return time.toISOString().split('T')[0]
  }
  
  return String(time)
}
</script>

<style scoped>
.badge-section {
  margin-top: 20px;
}

.badge-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.badge-card {
  position: relative;
  padding: 14px 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  overflow: hidden;
}

.badge-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.badge-card.unlocked {
  background: linear-gradient(135deg, #fff9e6 0%, #ffeaa7 100%);
  border-color: #f39c12;
}

.badge-card.locked {
  opacity: 0.65;
  filter: grayscale(50%);
}

.badge-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
}

.badge-icon {
  font-size: 36px;
  line-height: 1;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

.badge-lock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.badge-info {
  min-height: 45px;
}

.badge-name {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  margin-bottom: 3px;
}

.badge-desc {
  font-size: 11px;
  color: #666;
  line-height: 1.3;
}

.badge-time,
.badge-hint {
  margin-top: 5px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-size: 11px;
  color: #52c41a;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-hint {
  color: #999;
}

.no-badge {
  grid-column: span 2;
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 30px 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
