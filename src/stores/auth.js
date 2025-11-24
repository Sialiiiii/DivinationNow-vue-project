import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'


export const useAuthStore = defineStore('auth', () => {

    const token = ref(localStorage.getItem('jwt_token'))
    const router = useRouter()
    const isAuthenticated = computed(() => !!token.value)
    
    function login(newToken) {
        token.value = newToken
        localStorage.setItem('jwt_token', newToken)
        // 登入成功後跳轉到會員資料頁
        router.push('/member-profile')
    }

    function logout() {
        token.value = null
        localStorage.removeItem('jwt_token')
        // 登出後跳轉回首頁
        router.push('/')
    }

    // 這個函數可以在 App.vue 中呼叫，確保頁面刷新後狀態依然存在
    function checkAuth() {
    token.value = localStorage.getItem('jwt_token')
    }

    return { token, isAuthenticated, login, logout, checkAuth }
})