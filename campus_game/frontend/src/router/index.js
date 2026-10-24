import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { handBackToHost } from '@/utils/hostAuth'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/views/VerifyEmail.vue')
  },
  {
    path: '/problems',
    name: 'Problems',
    component: () => import('@/views/Problems.vue')
  },
  {
    path: '/problem/:id',
    name: 'ProblemDetail',
    component: () => import('@/views/ProblemDetail.vue')
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    // 算法哥：登录后的入口，题目、题单、排名都从这里进
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/AgentChat.vue'),
    meta: { requiresAuth: true }
  },
  {
    // 侧边栏版个人中心（/user/*）已删掉，只保留主页版 /profile。
    // 旧链接一律引过去，免得出现空白页。
    path: '/user/:pathMatch(.*)*',
    redirect: '/profile'
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Layout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue')
      },
      {
        path: 'problems',
        name: 'ProblemManagement',
        component: () => import('@/views/admin/ProblemManagement.vue')
      },
      {
        path: 'submissions',
        name: 'SubmissionManagement',
        component: () => import('@/views/admin/SubmissionManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.token) {
    // ⭐ 二期 §3.1.2：抽屉里不弹登录页 —— 报给宿主，由地图那张唯一的门去补票。
    //    `next(false)` 是**干净地**中止这次导航；挂着一个永不 resolve 的导航会让
    //    后续每次 router.push 都卡死。
    if (handBackToHost('进入 ' + to.fullPath + ' 需要登录')) return next(false)
    next('/login')
  } else if (to.meta.requiresAdmin && userStore.user?.role !== 'ADMIN') {
    next('/home')
  } else {
    next()
  }
})

export default router
