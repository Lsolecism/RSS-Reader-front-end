import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import TestView from "@/views/TestView.vue";
import {useUserStore} from "@/stores/useUserStore.js";
import ShowView from "@/views/ShowView.vue";


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
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta:{ requiresAuth: false}
    },
    {
      path: '/show',
      name: 'show',
      component: ShowView
    }
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // 从 store 获取认证状态
  const isAuthenticated = !!userStore.Email
  // 需要认证且未登录的情况
  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'loginPage',
      query: { redirect: to.fullPath } // 携带来源路径
    }
  }


  // 不知道怎么处理
  // 已登录用户禁止访问登录页
  // if (to.name === 'loginPage' && isAuthenticated) {
  //   return { name: 'home', params: { id: userStore.userId } } // 使用实际用户ID
  // }

  return true
})
export default router
