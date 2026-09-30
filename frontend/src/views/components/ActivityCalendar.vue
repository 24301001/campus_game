<template>
  <div class="activity-calendar">
    <h3 class="calendar-title">
      <el-icon><Calendar /></el-icon>
      年提交记录
      <span class="year-label">{{ currentYear }}</span>
    </h3>
    
    <div class="calendar-container" ref="calendarContainer">
      <div class="months-wrapper">
        <div 
          v-for="(month, index) in monthsData" 
          :key="index"
          class="month-column"
        >
          <div class="month-header">{{ month.name }}</div>
          <div class="days-grid">
            <div
              v-for="day in month.days"
              :key="day.date"
              class="day-cell"
              :class="{ 'has-activity': day.hasActivity }"
              :title="`${day.date} ${day.hasActivity ? '已提交' : '无记录'}`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="totalActivityDays > 0" class="activity-summary">
      <span>共 {{ totalActivityDays }} 天有提交</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const currentYear = new Date().getFullYear()

const monthsData = computed(() => {
  const months = []
  
  for (let i = 1; i <= 12; i++) {
    const daysInMonth = new Date(currentYear, i, 0).getDate()
    const monthName = `${i}月`
    const days = []
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(i).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      
      const hasActivity = props.data.some(activity => {
        if (!activity || !activity.date) return false
        
        let activityDate = ''
        
        if (Array.isArray(activity.date)) {
          const [year, month, day] = activity.date
          activityDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        } else if (activity.date instanceof Date) {
          activityDate = activity.date.toISOString().split('T')[0]
        } else {
          activityDate = String(activity.date).split('T')[0]
        }
        
        return activityDate === dateStr
      })
      
      days.push({
        day: d,
        date: dateStr,
        hasActivity
      })
    }
    
    months.push({
      name: monthName,
      days,
      hasAnyActivity: days.some(d => d.hasActivity)
    })
  }
  
  return months
})

const totalActivityDays = computed(() => {
  let count = 0
  monthsData.value.forEach(month => {
    month.days.forEach(day => {
      if (day.hasActivity) count++
    })
  })
  return count
})

const totalSubmissions = computed(() => {
  return props.data.length || 0
})
</script>

<style scoped>
.activity-calendar {
  background: rgba(30, 30, 35, 0.95);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
}

.calendar-title {
  font-size: 18px;
  color: #fff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-label {
  font-size: 14px;
  color: #999;
  font-weight: normal;
  margin-left: auto;
}

.calendar-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.calendar-container::-webkit-scrollbar {
  height: 8px;
}

.calendar-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.calendar-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.months-wrapper {
  display: flex;
  gap: 10px;
  min-width: max-content;
  padding: 4px;
}

.month-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.month-header {
  font-size: 13px;
  color: #999;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: rgba(50, 50, 55, 0.95);
  border: 1px solid rgba(80, 80, 85, 0.5);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.day-cell:hover {
  transform: scale(1.3);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.day-cell.has-activity {
  background: #52c41a;
  border-color: #52c41a;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.activity-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.total-submissions {
  color: #52c41a;
  font-weight: 600;
}
</style>