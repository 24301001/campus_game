<template>
  <div class="problem-stats-circle">
    <div class="left-section" @mouseenter="showAccuracy = true" @mouseleave="showAccuracy = false">
      <svg :viewBox="viewBox" class="gauge-svg">
        <defs>
          <linearGradient id="easyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#52c41a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#73d13d;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="mediumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#faad14;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffc53d;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="hardGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f5222d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff4d4f;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- 背景圆环 -->
        <circle
          :cx="centerX"
          :cy="centerY"
          :r="radius"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          stroke-width="14"
        />

        <!-- 简单 - 左侧弧 背景边框 (195° 到 255°) -->
        <path
          :d="getArcPath(195, 255)"
          fill="none"
          stroke="rgba(82, 196, 26, 0.15)"
          stroke-width="12"
          stroke-linecap="round"
        />

        <!-- 简单 - 左侧弧 (195° 到 255°) 按比例填充 -->
        <path
          :d="getArcPathByPercent(195, 255, easyPercent)"
          fill="none"
          stroke="url(#easyGrad)"
          stroke-width="10"
          stroke-linecap="round"
          style="filter: drop-shadow(0 0 3px rgba(82, 196, 26, 0.5))"
        />

        <!-- 中等 - 上方弧 背景边框 (285° 到 345°) -->
        <path
          :d="getArcPath(285, 345)"
          fill="none"
          stroke="rgba(250, 173, 20, 0.15)"
          stroke-width="12"
          stroke-linecap="round"
        />

        <!-- 中等 - 上方弧 (285° 到 345°) 按比例填充 -->
        <path
          :d="getArcPathByPercent(285, 345, mediumPercent)"
          fill="none"
          stroke="url(#mediumGrad)"
          stroke-width="10"
          stroke-linecap="round"
          style="filter: drop-shadow(0 0 3px rgba(250, 173, 20, 0.5))"
        />

        <!-- 困难 - 右侧弧 背景边框 (15° 到 75°) -->
        <path
          :d="getArcPath(15, 75)"
          fill="none"
          stroke="rgba(245, 34, 45, 0.15)"
          stroke-width="12"
          stroke-linecap="round"
        />

        <!-- 困难 - 右侧弧 (15° 到 75°) 按比例填充 -->
        <path
          :d="getArcPathByPercent(15, 75, hardPercent)"
          fill="none"
          stroke="url(#hardGrad)"
          stroke-width="10"
          stroke-linecap="round"
          style="filter: drop-shadow(0 0 3px rgba(245, 34, 45, 0.5))"
        />
      </svg>
      
      <div class="center-info">
        <div v-if="!showAccuracy" class="total-display">
          <span class="total-count">{{ totalSubmittedProblems }}</span><span class="total-separator"> / </span><span class="total-db">{{ totalProblemsInDB }}</span>
        </div>
        
        <div v-if="showAccuracy" class="accuracy-display">
          <div class="accuracy-value">{{ realAccuracyRate }}%</div>
          <div class="accuracy-label">通过率</div>
        </div>
        
        <div class="status-text">
          <el-icon color="#1890ff"><Edit /></el-icon>
          已作答
        </div>
      </div>
    </div>
    
    <div class="right-section">
      <div class="difficulty-card easy-card">
        <div class="difficulty-name">简单</div>
        <div class="difficulty-count">{{ easyCount }}/{{ easyInDB }}</div>
        <div class="difficulty-percent">{{ (easyPercent * 100).toFixed(0) }}%</div>
      </div>
      
      <div class="difficulty-card medium-card">
        <div class="difficulty-name">中等</div>
        <div class="difficulty-count">{{ mediumCount }}/{{ mediumInDB }}</div>
        <div class="difficulty-percent">{{ (mediumPercent * 100).toFixed(0) }}%</div>
      </div>
      
      <div class="difficulty-card hard-card">
        <div class="difficulty-name">困难</div>
        <div class="difficulty-count">{{ hardCount }}/{{ hardInDB }}</div>
        <div class="difficulty-percent">{{ (hardPercent * 100).toFixed(0) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const showAccuracy = ref(false)

const svgSize = 220
const centerX = svgSize / 2
const centerY = svgSize / 2
const radius = 85

const viewBox = `0 0 ${svgSize} ${svgSize}`

const acceptedProblems = computed(() => props.data.acceptedProblems || 0)
const totalProblemsInDB = computed(() => props.data.totalProblemsInDB || 0)
const totalSubmittedProblems = computed(() => props.data.totalSubmittedProblems || 0)

const easyCount = computed(() => props.data.easyCount || 0)
const mediumCount = computed(() => props.data.mediumCount || 0)
const hardCount = computed(() => props.data.hardCount || 0)
const easyInDB = computed(() => props.data.easyProblemsInDB || 0)
const mediumInDB = computed(() => props.data.mediumProblemsInDB || 0)
const hardInDB = computed(() => props.data.hardProblemsInDB || 0)

const realAccuracyRate = computed(() => {
  if (totalSubmittedProblems.value === 0) return 0
  return Math.round((acceptedProblems.value / totalSubmittedProblems.value) * 100 * 10) / 10
})

const easyPercent = computed(() => {
  return easyInDB.value > 0 ? (easyCount.value / easyInDB.value) : 0
})

const mediumPercent = computed(() => {
  return mediumInDB.value > 0 ? (mediumCount.value / mediumInDB.value) : 0
})

const hardPercent = computed(() => {
  return hardInDB.value > 0 ? (hardCount.value / hardInDB.value) : 0
})

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function describeArc(x, y, radius, startAngle, endAngle) {
  let actualEndAngle = endAngle
  if (endAngle > 360) {
    actualEndAngle = endAngle % 360
  }
  
  const start = polarToCartesian(x, y, radius, actualEndAngle)
  const end = polarToCartesian(x, y, radius, startAngle)
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1"
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ")
}

function getArcPath(startAngle, endAngle) {
  return describeArc(centerX, centerY, radius, startAngle, endAngle)
}

function getArcPathByPercent(startAngle, endAngle, percent) {
  if (percent <= 0) {
    return describeArc(centerX, centerY, radius, startAngle, startAngle + 1)
  }
  
  if (percent >= 1) {
    return describeArc(centerX, centerY, radius, startAngle, endAngle)
  }
  
  const totalAngle = endAngle - startAngle
  const filledAngle = totalAngle * percent
  
  return describeArc(centerX, centerY, radius, startAngle, startAngle + filledAngle)
}
</script>

<style scoped>
.problem-stats-circle {
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 20px;
}

.left-section {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.gauge-svg {
  width: 220px;
  height: 220px;
}

.center-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  text-align: center;
  pointer-events: none;
}

.total-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0;
}

.total-count {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.total-separator {
  font-size: 18px;
  color: #999;
  font-weight: 600;
}

.total-db {
  font-size: 18px;
  color: #666;
  font-weight: 600;
}

.accuracy-display {
  animation: fadeIn 0.3s ease;
}

.accuracy-value {
  font-size: 32px;
  font-weight: 700;
  color: #52c41a;
  line-height: 1.2;
}

.accuracy-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.status-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #1890ff;
  margin-top: 8px;
  font-weight: 500;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.difficulty-card {
  padding: 16px 24px;
  border-radius: 10px;
  background: rgba(30, 30, 35, 0.95);
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.difficulty-card:hover {
  background: rgba(40, 40, 45, 0.95);
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.easy-card {
  border-color: #52c41a;
}

.medium-card {
  border-color: #faad14;
}

.hard-card {
  border-color: #f5222d;
}

.difficulty-name {
  font-size: 15px;
  margin-bottom: 6px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.easy-card .difficulty-name {
  color: #52c41a;
}

.medium-card .difficulty-name {
  color: #faad14;
}

.hard-card .difficulty-name {
  color: #f5222d;
}

.difficulty-count {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
}

.difficulty-percent {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
</style>