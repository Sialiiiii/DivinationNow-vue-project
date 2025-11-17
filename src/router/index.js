import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // \加入 scrollBehavior 屬性
  scrollBehavior(to, from, savedPosition) {
    // 1. 如果有保存的位置（如瀏覽器的後退/前進），則使用該位置
    if (savedPosition) {
      return savedPosition;
    } 
    
    // 2. 否則，滾動到頁面頂部 (X: 0, Y: 0)
    else {
      return { top: 0, left: 0 };
    }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/TheBookOfAnswersDivination',
      name: 'TheBookOfAnswersDivination',
      component: () => import('../views/TheBookOfAnswersDivinationView.vue')
    },
    {
      path: '/RunesOneDivination',
      name: 'RunesOneDivination',
      component: () => import('../views/RunesOneDivinationView.vue')
    },
    {
      path: '/RunesTwoDivination',
      name: 'RunesTwoDivination',
      component: () => import('../views/RunesTwoDivinationView.vue')
    },
     {
      path: '/FortuneStickOneDivination',
      name: 'FortuneStickOneDivination',
      component: () => import('../views/FortuneStickOneDivinationView.vue')
    },
     {
      path: '/FortuneStickTwoDivination',
      name: 'FortuneStickTwoDivination',
      component: () => import('../views/FortuneStickTwoDivinationView.vue')
    }
  ]
})

export default router
