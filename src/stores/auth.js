import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const router = useRouter() 
    const isAuthenticated = computed(() => !!user.value)

    function checkAuth() {}
    

    /**
     * 處理登入成功
     * @param {Object} userData - 來自後端 API 響應的 User Entity
     * @param {string} [redirectPath='/']
     */
    function login(userData, redirectPath = '/') {
        setUser(userData) 
        
        if (router && router.push) {
            router.push(redirectPath) 
        }
    }

    function logout() {
        user.value = null
        if (router && router.push) {
            router.push('/')
        }
    }
 
    function setUser(userData) {
        user.value = userData;
    }

   
    const getUserID = computed(() => user.value?.id || null)
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