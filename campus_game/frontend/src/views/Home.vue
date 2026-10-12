<template>
  <div class="home">
    <!-- Navbar -->
    <nav class="navbar" :class="{ 'navbar-scrolled': scrolled }">
      <div class="nav-inner">
        <div class="nav-logo" @click="$router.push('/home')">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span class="logo-text">Code<span class="logo-accent">Craft</span></span>
        </div>
        <div class="nav-links">
          <router-link to="/problems" class="nav-link">题库</router-link>
          <template v-if="userStore.user">
            <router-link to="/agent" class="nav-link">算法哥</router-link>
            <router-link to="/profile" class="nav-link">个人中心</router-link>
            <router-link v-if="userStore.user.role === 'ADMIN'" to="/admin/dashboard" class="nav-link">管理</router-link>
            <span class="nav-user" @click="$router.push('/profile')">
              {{ userStore.user.nickname || userStore.user.username }}
            </span>
            <button class="btn btn-outline btn-sm" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <button class="btn btn-outline btn-sm" @click="$router.push('/login')">登录</button>
            <button class="btn btn-primary btn-sm" @click="$router.push('/register')">注册</button>
          </template>
        </div>
        <!-- Mobile menu toggle -->
        <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ open: mobileOpen }">
        <router-link to="/problems" class="mobile-link" @click="mobileOpen = false">题库</router-link>
        <template v-if="userStore.user">
          <router-link to="/agent" class="mobile-link" @click="mobileOpen = false">算法哥</router-link>
          <router-link to="/profile" class="mobile-link" @click="mobileOpen = false">个人中心</router-link>
          <router-link v-if="userStore.user.role === 'ADMIN'" to="/admin/dashboard" class="mobile-link" @click="mobileOpen = false">管理</router-link>
          <button class="btn btn-outline btn-full" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <button class="btn btn-outline btn-full" @click="$router.push('/login'); mobileOpen = false">登录</button>
          <button class="btn btn-primary btn-full" @click="$router.push('/register'); mobileOpen = false">注册</button>
        </template>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="gradient-sphere sphere-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">🎯 在线编程学习平台</div>
        <h1 class="hero-title">
          用代码<br/>
          <span class="gradient-text">改变世界</span>
        </h1>
        <p class="hero-subtitle">
          从入门到精通，海量题目等你挑战。<br/>
          实时编译，即时反馈，让每一行代码都有回响。
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" @click="$router.push('/problems')">
            开始刷题
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button class="btn btn-ghost btn-lg" @click="$router.push('/register')">
            免费注册
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <span class="stat-number" ref="statRefs">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="code-window">
          <div class="code-header">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <span class="code-title">solution.java</span>
          </div>
          <div class="code-body">
            <pre><span class="kw">class</span> <span class="type">Solution</span> {<br/>    <span class="kw">public</span> <span class="type">int</span>[][] <span class="fn">merge</span>(<span class="type">int</span>[][] intervals) {<br/>        <span class="comment">// 排序 + 合并区间</span><br/>        <span class="type">Arrays</span>.<span class="fn">sort</span>(intervals, (a, b) <br/>            -> <span class="type">Integer</span>.<span class="fn">compare</span>(a[<span class="num">0</span>], b[<span class="num">0</span>]));<br/>        <span class="type">List</span>&lt;<span class="type">int</span>[]&gt; res = <span class="kw">new</span> <span class="type">ArrayList</span>&lt;&gt;();<br/>        <span class="kw">for</span> (<span class="type">int</span>[] i : intervals) {<br/>            <span class="kw">if</span> (res.<span class="fn">isEmpty</span>() || <br/>                res.<span class="fn">get</span>(res.<span class="fn">size</span>() - <span class="num">1</span>)[<span class="num">1</span>] &lt; i[<span class="num">0</span>])<br/>                res.<span class="fn">add</span>(i);<br/>            <span class="kw">else</span><br/>                res.<span class="fn">get</span>(res.<span class="fn">size</span>() - <span class="num">1</span>)[<span class="num">1</span>] = <br/>                    <span class="type">Math</span>.<span class="fn">max</span>(...);<br/>        }<br/>        <span class="kw">return</span> res.<span class="fn">toArray</span>(<span class="kw">new</span> <span class="type">int</span>[<span class="num">0</span>][]);<br/>    }<br/>}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="section-header">
        <span class="section-badge">为什么选择我们</span>
        <h2>强大而简洁的学习工具</h2>
        <p>专为编程学习者打造的一站式平台</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" v-for="(f, i) in features" :key="i"
             :style="{ animationDelay: i * 0.1 + 's' }"
             @mouseenter="f.hover = true" @mouseleave="f.hover = false">
          <div class="feature-icon-wrap" :class="f.color">
            <component :is="f.icon" class="feature-icon" />
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-bg">
        <!-- Deep tech grid -->
        <div class="grid-overlay"></div>
        <!-- Central glow -->
        <div class="center-glow"></div>
        <!-- Floating cosmic orbs -->
        <div class="cosmic-orb co-1"></div>
        <div class="cosmic-orb co-2"></div>
        <div class="cosmic-orb co-3"></div>
        <div class="cosmic-orb co-4"></div>
        <div class="cosmic-orb co-5"></div>
        <!-- Ripple rings -->
        <div class="ripple r-1"></div>
        <div class="ripple r-2"></div>
        <div class="ripple r-3"></div>
        <!-- Star particles 22 -->
        <div class="star s-1"></div><div class="star s-2"></div><div class="star s-3"></div>
        <div class="star s-4"></div><div class="star s-5"></div><div class="star s-6"></div>
        <div class="star s-7"></div><div class="star s-8"></div><div class="star s-9"></div>
        <div class="star s-10"></div><div class="star s-11"></div><div class="star s-12"></div>
        <div class="star s-13"></div><div class="star s-14"></div><div class="star s-15"></div>
        <div class="star s-16"></div><div class="star s-17"></div><div class="star s-18"></div>
        <div class="star s-19"></div><div class="star s-20"></div><div class="star s-21"></div>
        <div class="star s-22"></div>
        <!-- Diagonal light beam -->
        <div class="light-beam"></div>
        <!-- Scanning line -->
        <div class="scan-line"></div>
      </div>
      <div class="stats-inner">
        <div class="section-header light">
          <h2>平台数据</h2>
          <p>不断增长的学习社区</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card" v-for="(s, idx) in platformStats" :key="s.label"
               :style="{ animationDelay: idx * 0.15 + 's' }">
            <span class="stat-card-number">
              {{ animatedValues[idx] }}{{ s.suffix }}
            </span>
            <span class="stat-card-label">{{ s.label }}</span>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: s.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>准备好了吗？</h2>
          <p>现在开始，用代码书写你的未来</p>
        </div>
        <button class="btn btn-primary btn-lg" @click="$router.push('/register')">
          立即开始
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span>CodeCraft 在线编程平台</span>
        </div>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">帮助中心</a>
          <a href="#">服务条款</a>
          <a href="#">隐私政策</a>
        </div>
        <p class="footer-copy">© 2026 CodeCraft. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const scrolled = ref(false)
const mobileOpen = ref(false)
// Scroll effect
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })

  // Start count-up when stats section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCountUp()
        observer.disconnect()
      }
    })
  }, { threshold: 0.3 })

  const el = document.querySelector('.stats-section')
  if (el) observer.observe(el)
})

const stats = computed(() => [
  { value: '2000+', label: '精选题目' },
  { value: '100', label: '题目分类' },
  { value: '100%', label: '实时编译' }
])

const platformStats = ref([
  { value: 2000, suffix: '+', label: '精选题目', percent: 85 },
  { value: 100, suffix: '', label: '题目分类', percent: 60 },
  { value: 1000, suffix: '+', label: '注册用户', percent: 70 },
  { value: 3000, suffix: '+', label: '提交次数', percent: 90 }
])

// Count-up animation
const animatedValues = ref([0, 0, 0, 0])

function startCountUp() {
  const targets = platformStats.value.map(s => s.value)
  const duration = 2000 // 2 seconds
  const steps = 60
  const increment = targets.map(t => Math.ceil(t / steps))
  let current = [0, 0, 0, 0]

  function tick(step) {
    if (step >= steps) {
      animatedValues.value = [...targets]
      return
    }
    for (let i = 0; i < 4; i++) {
      current[i] = Math.min(current[i] + increment[i], targets[i])
    }
    animatedValues.value = [...current]
    requestAnimationFrame(() => {
      setTimeout(() => tick(step + 1), duration / steps)
    })
  }

  tick(0)
}

const features = ref([
  { icon: 'Files', title: '丰富题库', desc: '算法、数据结构、Java基础、SQL，覆盖多种难度等级，循序渐进提升编程能力。', color: 'blue', hover: false },
  { icon: 'Monitor', title: '在线 IDE', desc: '内置 Monaco 代码编辑器，语法高亮、代码补全，沉浸式编码体验。', color: 'purple', hover: false },
  { icon: 'Cpu', title: '实时判题', desc: '提交即编译，即时反馈运行结果。错误定位准确，学习效率翻倍。', color: 'green', hover: false },
  { icon: 'DataLine', title: '学习统计', desc: '刷题记录、通过率、活跃度一目了然，数据驱动你的成长轨迹。', color: 'orange', hover: false },
  { icon: 'Star', title: '收藏笔记', desc: '收藏好题、记录笔记，构建你的专属知识库，温故而知新。', color: 'red', hover: false },
  { icon: 'User', title: '社区交流', desc: '与同学一起刷题，互相激励。管理员全程支持，答疑解惑。', color: 'teal', hover: false }
])

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出')
  router.push('/home')
}
</script>

<style scoped>
/* ==========================
   Global Styles
   ========================== */
.home {
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ==========================
   Navbar
   ========================== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.3s ease;
}
.navbar-scrolled {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 10px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: white;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.logo-accent {
  color: #818cf8;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-link {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-link:hover {
  color: white;
  background: rgba(255,255,255,0.08);
}
.nav-user {
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.mobile-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: 0.3s;
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px 24px;
  background: rgba(15,23,42,0.95);
  backdrop-filter: blur(20px);
}
.mobile-menu.open { display: flex; }
.mobile-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
}
.mobile-link:hover { background: rgba(255,255,255,0.06); color: white; }

/* ==========================
   Buttons
   ========================== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.25s ease;
  text-decoration: none;
  font-family: inherit;
}
.btn-sm { padding: 8px 18px; font-size: 14px; }
.btn-lg { padding: 14px 32px; font-size: 16px; border-radius: 14px; }
.btn-full { width: 100%; justify-content: center; padding: 12px; }
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 15px rgba(99,102,241,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99,102,241,0.5);
}
.btn-outline {
  background: transparent;
  color: rgba(255,255,255,0.9);
  border: 1.5px solid rgba(255,255,255,0.2);
}
.btn-outline:hover {
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.06);
}
.btn-ghost {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.8);
}
.btn-ghost:hover { background: rgba(255,255,255,0.12); color: white; }

/* ==========================
   Hero Section
   ========================== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
  background: #0f172a;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}
.sphere-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  top: -200px; right: -200px;
  animation-delay: 0s;
}
.sphere-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #8b5cf6, transparent 70%);
  bottom: -150px; left: -150px;
  animation-delay: -7s;
}
.sphere-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #06b6d4, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(20px, 30px) scale(1.02); }
}

.hero-content {
  position: relative;
  flex: 1;
  max-width: 600px;
  z-index: 1;
}
.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 20px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
}
.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.15;
  color: white;
  margin-bottom: 20px;
  letter-spacing: -1px;
}
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: rgba(255,255,255,0.6);
  margin-bottom: 36px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
}
.hero-stats {
  display: flex;
  gap: 40px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: white;
}
.stat-label {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}

/* Hero Visual - Code Window */
.hero-visual {
  position: relative;
  flex: 1;
  max-width: 500px;
  z-index: 1;
  margin-left: 40px;
}
.code-window {
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  transform: perspective(1000px) rotateY(-3deg);
  transition: transform 0.5s ease;
}
.code-window:hover {
  transform: perspective(1000px) rotateY(0deg);
}
.code-header {
  padding: 14px 16px;
  background: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.dot {
  width: 12px; height: 12px;
  border-radius: 50%;
}
.red { background: #ef4444; }
.yellow { background: #eab308; }
.green { background: #22c55e; }
.code-title {
  margin-left: 12px;
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}
.code-body {
  padding: 20px;
  overflow-x: auto;
}
.code-body pre {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.65;
  color: #e2e8f0;
}
.code-body :deep(.kw) { color: #c084fc; }
.code-body :deep(.type) { color: #67e8f9; }
.code-body :deep(.fn) { color: #818cf8; }
.code-body :deep(.comment) { color: #64748b; font-style: italic; }
.code-body :deep(.num) { color: #f472b6; }

/* ==========================
   Features Section
   ========================== */
.features {
  padding: 100px 24px;
  background: #f8fafc;
}
.section-header {
  text-align: center;
  max-width: 500px;
  margin: 0 auto 56px;
}
.section-header h2 {
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.section-header p {
  font-size: 16px;
  color: rgba(15,23,42,0.6);
  line-height: 1.6;
}
.section-header.light h2 { color: white; }
.section-header.light p { color: rgba(255,255,255,0.6); }
.section-badge {
  display: inline-block;
  padding: 4px 14px;
  background: rgba(99,102,241,0.1);
  border-radius: 20px;
  font-size: 13px;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 16px;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}
.feature-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 36px 28px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeUp 0.6s ease both;
  cursor: default;
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(99,102,241,0.1);
  border-color: #c7d2fe;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.feature-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
}
.feature-icon-wrap.blue { background: #eef2ff; color: #6366f1; }
.feature-icon-wrap.purple { background: #f5f3ff; color: #8b5cf6; }
.feature-icon-wrap.green { background: #f0fdf4; color: #22c55e; }
.feature-icon-wrap.orange { background: #fff7ed; color: #f97316; }
.feature-icon-wrap.red { background: #fef2f2; color: #ef4444; }
.feature-icon-wrap.teal { background: #f0fdfa; color: #14b8a6; }
.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}
.feature-card p {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(15,23,42,0.6);
}

/* ==========================
   Stats Section - Premium Dark
   ========================== */
.stats-section {
  position: relative;
  padding: 100px 24px;
  background: #070b17;
  overflow: hidden;
  isolation: isolate;
}
.stats-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* 1. Tech grid pattern */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridPulse 6s ease-in-out infinite;
}
@keyframes gridPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 2. Central glow */
.center-glow {
  position: absolute;
  top: 50%; left: 50%;
  width: 800px; height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 30%, transparent 60%);
  animation: centerBreath 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes centerBreath {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
}

/* 3. Cosmic floating orbs (replacing old orbs) */
.cosmic-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  mix-blend-mode: screen;
  pointer-events: none;
}
.co-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%);
  top: -10%; left: -5%;
  animation: coFloat1 18s ease-in-out infinite;
}
.co-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%);
  bottom: -10%; right: -5%;
  animation: coFloat2 22s ease-in-out infinite;
}
.co-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%);
  top: 40%; left: 50%;
  animation: coFloat3 15s ease-in-out infinite;
}
.co-4 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%);
  top: 60%; right: 30%;
  animation: coFloat4 20s ease-in-out infinite;
}
.co-5 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%);
  bottom: -20%; left: 20%;
  animation: coFloat5 25s ease-in-out infinite;
}
@keyframes coFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  33% { transform: translate(120px, 60px) scale(1.1); opacity: 0.5; }
  66% { transform: translate(60px, -40px) scale(0.9); opacity: 0.4; }
}
@keyframes coFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
  25% { transform: translate(-100px, -50px) scale(1.15); opacity: 0.45; }
  50% { transform: translate(40px, 80px) scale(0.85); opacity: 0.3; }
  75% { transform: translate(-60px, 30px) scale(1.05); opacity: 0.4; }
}
@keyframes coFloat3 {
  0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 0.2; }
  50% { transform: translate(calc(-50% + 80px), -30px) scale(1.2); opacity: 0.4; }
}
@keyframes coFloat4 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
  50% { transform: translate(-40px, -60px) scale(1.1); opacity: 0.35; }
}
@keyframes coFloat5 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
  50% { transform: translate(80px, -40px) scale(1.2); opacity: 0.3; }
}

/* 4. Expanding ripple rings */
.ripple {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(99,102,241,0.1);
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
}
.r-1 {
  animation: rippleExpand 8s ease-out infinite;
}
.r-2 {
  animation: rippleExpand 8s ease-out infinite 2.5s;
}
.r-3 {
  animation: rippleExpand 8s ease-out infinite 5s;
}
@keyframes rippleExpand {
  0% { width: 100px; height: 100px; opacity: 0.4; transform: translate(-50%, -50%) scale(0); }
  50% { width: 100px; height: 100px; opacity: 0.15; }
  100% { width: 100px; height: 100px; opacity: 0; transform: translate(-50%, -50%) scale(8); }
}

/* 5. Stars particles */
.star {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: white;
  animation: starTwinkle var(--dur, 4s) ease-in-out infinite;
}
@keyframes starTwinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.8); }
}
.s-1 { width: 2px; height: 2px; top: 8%; left: 12%; --dur: 3.2s; animation-delay: 0s; }
.s-2 { width: 3px; height: 3px; top: 15%; left: 45%; --dur: 4.5s; animation-delay: -0.5s; background: #818cf8; }
.s-3 { width: 2px; height: 2px; top: 22%; left: 78%; --dur: 3.8s; animation-delay: -1.2s; }
.s-4 { width: 1px; height: 1px; top: 30%; left: 25%; --dur: 5s; animation-delay: -0.8s; }
.s-5 { width: 3px; height: 3px; top: 35%; left: 60%; --dur: 3.5s; animation-delay: -2s; background: #a78bfa; }
.s-6 { width: 2px; height: 2px; top: 42%; left: 8%; --dur: 4.2s; animation-delay: -1.5s; }
.s-7 { width: 1px; height: 1px; top: 48%; left: 88%; --dur: 3.9s; animation-delay: -0.3s; }
.s-8 { width: 2px; height: 2px; top: 55%; left: 35%; --dur: 4.8s; animation-delay: -2.5s; background: #67e8f9; }
.s-9 { width: 3px; height: 3px; top: 62%; left: 72%; --dur: 3.1s; animation-delay: -1.8s; }
.s-10 { width: 1px; height: 1px; top: 70%; left: 18%; --dur: 4.6s; animation-delay: -3s; background: #c084fc; }
.s-11 { width: 2px; height: 2px; top: 75%; left: 55%; --dur: 3.7s; animation-delay: -0.7s; }
.s-12 { width: 2px; height: 2px; top: 82%; left: 40%; --dur: 4.3s; animation-delay: -2.2s; }
.s-13 { width: 1px; height: 1px; top: 5%; right: 15%; --dur: 3.4s; animation-delay: -1s; }
.s-14 { width: 3px; height: 3px; top: 90%; left: 82%; --dur: 4.9s; animation-delay: -3.5s; background: #6366f1; }
.s-15 { width: 2px; height: 2px; top: 45%; left: 50%; --dur: 3.6s; animation-delay: -0.2s; }
.s-16 { width: 1px; height: 1px; top: 25%; right: 35%; --dur: 5.1s; animation-delay: -4s; background: #93c5fd; }
.s-17 { width: 2px; height: 2px; top: 65%; left: 15%; --dur: 4s; animation-delay: -1.4s; }
.s-18 { width: 3px; height: 3px; top: 10%; left: 65%; --dur: 3.3s; animation-delay: -2.8s; background: #c4b5fd; }
.s-19 { width: 1px; height: 1px; top: 78%; right: 60%; --dur: 4.7s; animation-delay: -0.9s; }
.s-20 { width: 2px; height: 2px; top: 33%; right: 50%; --dur: 3.5s; animation-delay: -3.2s; }
.s-21 { width: 2px; height: 2px; top: 58%; right: 8%; --dur: 4.1s; animation-delay: -1.1s; background: #a5b4fc; }
.s-22 { width: 1px; height: 1px; top: 88%; left: 28%; --dur: 4.4s; animation-delay: -2.6s; }

/* 6. Diagonal light beam sweep */
.light-beam {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 25%,
    rgba(255,255,255,0.01) 38%,
    rgba(255,255,255,0.02) 42%,
    rgba(255,255,255,0.005) 46%,
    transparent 60%,
    transparent 100%
  );
  animation: beamSweep 10s ease-in-out infinite;
  pointer-events: none;
}
@keyframes beamSweep {
  0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
  15% { opacity: 0.6; }
  50% { transform: translateX(120%) skewX(-12deg); opacity: 0.6; }
  65% { opacity: 0; }
  100% { transform: translateX(250%) skewX(-12deg); opacity: 0; }
}

/* 7. Horizontal scan line */
.scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent);
  animation: scanMove 6s linear infinite;
  pointer-events: none;
}
@keyframes scanMove {
  0% { top: -2%; opacity: 0; }
  10% { opacity: 0.6; }
  50% { top: 50%; opacity: 0.8; }
  90% { opacity: 0.6; }
  100% { top: 102%; opacity: 0; }
}

/* Stats inner */
.stats-inner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  z-index: 1;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Stat cards */
.stat-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 36px 24px;
  text-align: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardFadeIn 0.8s ease both;
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(99,102,241,0.06), transparent 50%);
  opacity: 0;
  transition: opacity 0.5s;
}
.stat-card:hover::before {
  opacity: 1;
}
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(129,140,248,0.2);
  box-shadow: 0 12px 40px rgba(99,102,241,0.1);
}

.stat-card-number {
  display: block;
  font-size: 42px;
  font-weight: 800;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #818cf8, #a78bfa, #67e8f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradShift 3s ease infinite;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
}
@keyframes gradShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.stat-card-label {
  display: block;
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}
.stat-bar {
  position: relative;
  z-index: 1;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 4px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==========================
   CTA Section
   ========================== */
.cta {
  padding: 80px 24px;
  background: #f8fafc;
}
.cta-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 64px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  box-shadow: 0 20px 60px rgba(99,102,241,0.3);
}
.cta-content h2 {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}
.cta-content p {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
}
.cta-card .btn-primary {
  background: white;
  color: #6366f1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  flex-shrink: 0;
}
.cta-card .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* ==========================
   Footer
   ========================== */
.footer {
  padding: 40px 24px;
  background: #0f172a;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  margin-bottom: 20px;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
}
.footer-links a {
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}
.footer-links a:hover { color: rgba(255,255,255,0.7); }
.footer-copy {
  font-size: 13px;
  color: rgba(255,255,255,0.25);
}

/* ==========================
   Responsive
   ========================== */
@media (max-width: 1024px) {
  .hero-title { font-size: 42px; }
  .hero-visual { display: none; }
  .hero-content { max-width: 100%; text-align: center; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-toggle { display: flex; }
  .hero-title { font-size: 36px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-stats { gap: 24px; }
  .features-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .cta-card { flex-direction: column; text-align: center; padding: 40px 28px; }
}
</style>
