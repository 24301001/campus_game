import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 暗色变量 + 像素主题（必须在 Element 之后引入才盖得住）
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/pixel-theme.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// 像素主题走 Element 的暗色变量体系，挂载前先打上标记，避免首屏闪一下白底
document.documentElement.classList.add('dark')

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
