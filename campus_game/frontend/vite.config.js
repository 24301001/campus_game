import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    // 3000 is the unified lobby gateway; the coding platform is proxied at /agent.
    port: 3001,
    strictPort: true,
    proxy: {
      /* ⚠️ 不能 rewrite 掉 /api：后端 server.servlet.context-path 就是 /api
         （nginx.conf 也是 /api/ → http://backend:8081/api/，保留前缀）。
         删前缀会让所有请求 404。 */
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      /* 学霸姐（xueba-ge，FastAPI 127.0.0.1:8010）。第四十一轮合体用。
         ⚠️ **同样不许 rewrite**：那边有一个纯 ASGI 中间件 PrefixStrip 专门剥 /xbg，
            而裸 /api/... 那条老路要留着（它的 tests/smoke_api.py 与 /docs 都还在裸路径上）。
         为什么非要绕这一道：学霸姐必须与地图**同源**，否则三件事一起坏 ——
            localStorage 不共享（进逸夫楼要重新登录）、
            父页拿不到 iframe 里的按键（Esc 退不出来）、
            cookie 跨站被 SameSite 拦掉（教材原件下载不了）。
         ⚠️ 键是**前缀匹配**：'/xbg' 与 '/api' 互不干扰，但别改成 '/' 或写成正则。 */
      '/xbg': {
        target: 'http://127.0.0.1:8010',
        changeOrigin: true
      },
      /* 保安 · 老丁（laoding，FastAPI 127.0.0.1:8000）。2026-10-09 合体用。
         ⚠️ **同样不 rewrite**：那边有一个纯 ASGI 中间件 PrefixStrip 专门剥 /ld，
            裸 /api/... 那条老路要留着（双击 run_server.bat 独立跑、/docs 都还在）。
         为什么非要绕这一道：老丁必须与地图**同源**，否则父页拿不到 iframe 里的按键
            （按 Esc 退不出来）、相对路径也全错。
         ⚠️ 键是**前缀匹配**：'/ld' 与 '/api'、'/xbg' 互不干扰。
         ⚠️⚠️ 线上地址里 `/ld` 必须有**斜杠**结尾才算前缀匹配到 `/ld/`，
            直接写 `/ld` 也匹配得来（Vite 按前缀走），但别写成 `ld` 或带正则。 */
      '/ld': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      /* 食堂阿姨（cmr，FastAPI 127.0.0.1:8020）。2026-10-11 合体用。
         ⚠️ **同样不 rewrite**：那边有一个纯 ASGI 中间件 PrefixStrip 专门剥 /cmr，
            裸 /api/... 那条老路要留着（独立跑 DEPLOY.md 那条、/docs 都还在）。
         为什么非要绕这一道：食堂必须与地图**同源**，否则父页拿不到 iframe 里的按键
            （按 Esc / 点「返回校园」都退不出来），而且她的 HttpOnly 会话 cookie 是
            SameSite=strict，跨站时 iframe 里的请求根本带不上 ⇒ 会一直弹登录框。
         ⚠️⚠️ **changeOrigin 必须是 false，不能照抄上面两家的 true**：
            阿姨的 check_origin() 拿浏览器的 Origin 头去比 request.base_url，而
            base_url 是由 **Host 头**推出来的。把 Host 改写成 127.0.0.1:8020 之后，
            它与同源请求带的 `Origin: http://localhost:3000` 不相等 ⇒ 四个 POST
            （login/logout/新会话/chat）**全部 403**，症状是「页面打得开、一发消息就失败」。
            changeOrigin:false 时 Host 原样穿过去，两边天然相等。老丁/学霸姐没有这道校验。 */
      '/cmr': {
        target: 'http://127.0.0.1:8020',
        changeOrigin: false
      }
    }
  }
})
