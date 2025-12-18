import { createRouter, createWebHistory } from 'vue-router'

// --- 1. 基礎頁面組件 (直接導入) ---
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MemberProfileView from '../views/MemberProfileView.vue'
import MoodSanctuaryView from '../views/MoodSanctuaryView.vue'
import AdminLoginView from '../views/AdminLoginView.vue' 
import AdminDashboardView from '../views/AdminDashboardView.vue'

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
        },

        // --- 💡 管理者功能頁面 ---
        {
            path: '/admin/login',
            name: 'admin-login',
            component: AdminLoginView,
            meta: { hideNav: true } // 可用來判斷是否隱藏一般導覽列
        },
        {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
            component: AdminDashboardView,
            meta: { requiresAdmin: true } // 💡 標記此頁面需要管理權限
        }
    ]
})

// --- 💡 2. 加入路由守衛：防止非管理員進入儀表板 ---
router.beforeEach((to, from, next) => {
    // 取得我們在登入成功時存入的 role (可以存在 localStorage)
    const userRole = localStorage.getItem('user_role');

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        // 如果要去的地方需要管理權限，但檢查身分不是 ADMIN
        if (userRole !== 'ADMIN') {
            alert('權限不足，請先以管理員身分登入');
            next('/admin/login');
        } else {
            next();
        }
    } else {
        next(); // 一般頁面直接放行
    }
});

export default router