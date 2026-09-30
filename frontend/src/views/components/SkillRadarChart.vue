<template>
  <div class="skill-radar-section">
    <h3>技能分析（按题目类型正确率）</h3>
    <div ref="chartRef" class="radar-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { PIXEL_THEME } from '@/utils/echartsTheme'

const props = defineProps({
  categoryStats: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(chartRef.value, PIXEL_THEME)

  const categories = Object.keys(props.categoryStats || {})
  const values = Object.values(props.categoryStats || {}).map(v => Number(v) || 0)

  if (categories.length === 0) {
    categories.push('暂无数据')
    values.push(0)
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        let result = params.name + '<br/>'
        categories.forEach((cat, i) => {
          result += cat + ': ' + (values[i] != null ? values[i] + '%' : '0%') + '<br/>'
        })
        return result
      }
    },
    radar: {
      indicator: categories.map(name => ({
        name: name,
        max: 100
      })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#666',
        fontSize: 12
      },
      splitLine: {
        lineStyle: { color: '#ddd' }
      },
      splitArea: {
        areaStyle: {
          color: ['#f5f5f5', '#e8e8e8', '#ddd', '#ccc']
        }
      },
      axisLine: {
        lineStyle: { color: '#999' }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: '正确率',
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.25)'
        },
        lineStyle: {
          color: '#1890ff',
          width: 2
        },
        itemStyle: {
          color: '#1890ff'
        }
      }]
    }]
  }

  chartInstance.setOption(option)
}

watch(() => props.categoryStats, () => {
  initChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped>
.skill-radar-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.radar-container {
  width: 100%;
  height: 350px;
}
</style>
