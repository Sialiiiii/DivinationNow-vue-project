import { createRouter, createWebHistory } from 'vue-router'

// --- 基礎頁面組件 (直接導入) ---
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MemberProfileView from '../views/MemberProfileView.vue'
import MoodSanctuaryView from '../views/MoodSanctuaryView.vue'
import AdminLoginView from '../views/AdminLoginView.vue' 
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminUserManageView from '../views/AdminUserManageView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    // --- 頁面滾動行為配置 ---
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } 
        else {
            return { top: 0, left: 0 };
        }
    },

    

    // --- 路由列表配置 ---
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
            path: '/member-profile',
            name: 'member-profile',
            component: MemberProfileView
        },
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



        // ---  管理者功能頁面 ---
        {
            path: '/admin/login',
            name: 'admin-login',
            component: AdminLoginView,
            meta: { hideNav: true }
        },
        {
            path: '/admin/dashboard',
            name: 'admin-dashboard',
            component: AdminDashboardView,
            meta: { requiresAdmin: true }
        },
        {
            path: '/admin/usermanage',
            name: 'admin-usermanage',
            component: AdminUserManageView,
            meta: { requiresAdmin: true }
        },
    ]
})

// --- 路由守衛，防止非管理員進入儀表板 ---
router.beforeEach((to, from, next) => {
    const userRole = localStorage.getItem('user_role');

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (userRole !== 'ADMIN') {
            alert('權限不足，請先以管理員身分登入');
            next('/admin/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router