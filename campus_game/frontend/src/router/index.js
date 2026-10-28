import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ensureAgentTicket } from '@/utils/lobbyAuth'

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
    redirect: '/agent'
  },
  {
    path: '/register',
    redirect: '/agent'
  },
  {
    path: '/verify-email',
    redirect: '/agent'
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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.token) {
    if (await ensureAgentTicket()) next()
    else { window.top.location.assign('/'); next(false) }
  } else if (to.meta.requiresAdmin && userStore.user?.role !== 'ADMIN') {
    next('/home')
  } else {
    next()
  }
})

export default router
