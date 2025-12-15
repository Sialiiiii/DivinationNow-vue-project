import { createRouter, createWebHistory } from 'vue-router'

// --- 1. 基礎頁面組件 (直接導入) ---
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MemberProfileView from '../views/MemberProfileView.vue'
import MoodSanctuaryView from '../views/MoodSanctuaryView.vue' // ⭐ 新增：心靈樹洞組件

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    // --- 2. 頁面滾動行為配置 ---
    scrollBehavior(to, from, savedPosition) {
        // 如果有保存的位置（如瀏覽器的後退/前進），則使用該位置
        if (savedPosition) {
            return savedPosition;
        } 
        
        // 否則，滾動到頁面頂部
        else {
            return { top: 0, left: 0 };
        }
    },

    // --- 3. 路由列表配置 ---
    routes: [
        // --- 基本用戶與會員頁面 ---
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
            path: '/member-profile',
            name: 'member-profile',
            component: MemberProfileView
        },
        
        // --- 心靈樹洞頁面 ---
        {
            path: '/sanctuary',
            name: 'sanctuary',
            component: MoodSanctuaryView
        },
        
        // --- 占卜功能頁面 (延遲加載) ---
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