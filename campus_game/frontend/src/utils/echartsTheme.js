/**
 * ECharts 的像素主题。
 *
 * 为什么必须做：ECharts 是 canvas 绘制，CSS 管不到它。
 * 它默认的文字/轴线是深灰色（#333 / #6e7079），放到深色卡片上就是"图表看着是空的"。
 * 这里注册一个主题，各图表 init 时带上主题名即可。
 */
import * as echarts from 'echarts'

const AXIS = '#39404d'
const SPLIT = '#2a2f39'
const TEXT = '#9fb4d0'
const STRONG = '#e9e5d8'

echarts.registerTheme('pixel', {
  // 和平台主色一致的系列配色
  color: ['#ffd76e', '#8fd0ff', '#4ade80', '#f87171', '#a78bfa', '#fbbf24', '#5eead4'],
  backgroundColor: 'transparent',
  textStyle: {
    color: TEXT,
    fontFamily: 'ui-monospace, Consolas, "Courier New", monospace'
  },
  title: { textStyle: { color: STRONG } },
  legend: { textStyle: { color: TEXT } },
  tooltip: {
    backgroundColor: '#1d2129',
    borderColor: AXIS,
    borderWidth: 1,
    textStyle: { color: STRONG },
    extraCssText: 'border-radius:0;box-shadow:3px 3px 0 rgba(0,0,0,.45)'
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: AXIS } },
    axisTick: { lineStyle: { color: AXIS } },
    axisLabel: { color: TEXT },
    splitLine: { lineStyle: { color: SPLIT } }
  },
  valueAxis: {
    axisLine: { lineStyle: { color: AXIS } },
    axisTick: { lineStyle: { color: AXIS } },
    axisLabel: { color: TEXT },
    splitLine: { lineStyle: { color: SPLIT } },
    nameTextStyle: { color: TEXT }
  },
  radar: {
    axisLine: { lineStyle: { color: AXIS } },
    splitLine: { lineStyle: { color: SPLIT } },
    splitArea: { areaStyle: { color: ['rgba(255,215,110,.04)', 'transparent'] } },
    axisName: { color: TEXT }
  }
})

/** 图表 init 时把这个名字传进去：echarts.init(el, PIXEL_THEME) */
export const PIXEL_THEME = 'pixel'
