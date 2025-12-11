import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {

    const user = ref(null) // 儲存完整的 User Entity，包含 ID
    
    const router = useRouter() 
    const isAuthenticated = computed(() => !!user.value) // 依賴 user 實例

    // 輔助函式：用來檢查登入狀態
    // 實務上，這裡應呼叫 /user/profile API 檢查 session 是否有效，
    // 但為簡化，我們只在登入時設置 user.value。
    function checkAuth() {
        // 在 Session 模式下，我們依賴後端 API 檢查 session 狀態
        // 但由於沒有 profile API，這裡暫時不執行任何操作
    }
    

    /**
     * 處理登入成功
     * @param {Object} userData - 來自後端 API 響應的 User Entity
     * @param {string} [redirectPath='/'] - 可選參數，登入後要跳轉的路徑
     */
    function login(userData, redirectPath = '/') { // 🚀 修正點 1: 接受 redirectPath 參數
        // 移除所有 localStorage 邏輯
        setUser(userData) 
        
        if (router && router.push) {
            router.push(redirectPath) 
        }
    }
    function logout() {
        user.value = null
        // 🚀 移除所有 localStorage 邏輯
        // 這裡應該呼叫後端 /auth/logout API 清除 Session，但我們專注於前端
        
        if (router && router.push) {
            router.push('/')
        }
    }
    
    function setUser(userData) {
        user.value = userData;
    }

    // 獲取 User ID 的 Getter (從 user.value 獲取 ID)
    const getUserID = computed(() => user.value?.id || null) // 🚀 注意：User Entity 的 PK 是 getId(), 對應 user.id (如果您的 Entity 遵循 Spring Data JPA 標準)

    // 獲取狀態 ID 的 Getter
    const getUserCareerStatusId = computed(() => user.value ? user.value.careerStatusId : null)
    const getUserRelationshipStatusId = computed(() => user.value ? user.value.relationshipStatusId : null)


    return { 
        user, 
        isAuthenticated, 
        getUserID,
        getUserCareerStatusId, 
        getUserRelationshipStatusId, 
        login, 
        logout, 
        checkAuth, 
        setUser 
    }
})