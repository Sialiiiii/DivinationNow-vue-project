import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; 
import router from '@/router';

let isAlerting = false; // 防止多次彈出警告

const axiosInstance = axios.create({
    baseURL: '/api', // 確保所有請求都帶有 /api 前綴
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 重要：允許攜帶 Cookie (Session ID)
});

/**
 * 請求攔截器
 */
axiosInstance.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * 響應攔截器：統一處理 401 錯誤，並區分管理者與使用者導向
 */
axiosInstance.interceptors.response.use(response => response, error => {
    
    const status = error.response ? error.response.status : null;
    
    // 當後端回傳 401，代表 Session 失效或未登入
    if (status === 401) {
        const authStore = useAuthStore();
        
        console.error("Session Unauthorized or Expired. Logging out...");
        
        if (!isAlerting) {
            isAlerting = true;
            alert('您的登入狀態已失效或無效，請重新登入。');
            
            // 1. 清除前端儲存的身分資訊（Pinia/Vuex）
            authStore.logout(); 
            
            // 2. 💡 關鍵改動：根據當前網址判斷要回哪一個登入頁面
            // 使用 window.location.pathname 來檢查
            const currentPath = window.location.pathname;

            if (currentPath.includes('/admin')) {
                // 如果是在管理後台頁面，則導向管理員登入頁
                router.push('/admin/login'); 
            } else {
                // 否則維持原樣，導向一般使用者登入頁
                router.push('/login'); 
            }
            
            // 延遲重設旗幟，避免 1 秒內重複彈窗
            setTimeout(() => { isAlerting = false; }, 1000);
        }
    }
    
    return Promise.reject(error);
});

export default axiosInstance;