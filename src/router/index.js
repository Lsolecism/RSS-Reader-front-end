import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import TestView from "@/views/TestView.vue";
import {useUserStore} from "@/stores/useUserStore.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: LoginView,
      meta:{ requiresAuth: false}
    },
    {
      path: '/home',
      name: 'qaq',
      component:MainView,
      meta:{ requiresAuth: true}
    },
    {
      path: '/home/:id(\\d+)',
      name: 'home',
      component:MainView,
      meta:{ requiresAuth: true}
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      component:TestView,
      meta:{ requiresAuth: true}
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta:{ requiresAuth: false}
    }
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 从 store 获取认证状态
  const isAuthenticated = !!userStore.userId

  // 需要认证且未登录的情况
  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'loginPage',
      query: { redirect: to.fullPath } // 携带来源路径
    }
  }

  // 已登录用户禁止访问登录页
  if (to.name === 'loginPage' && isAuthenticated) {
    return { name: 'home', params: { id: userStore.id } } // 使用实际用户ID
  }

  return true
})
export default router
