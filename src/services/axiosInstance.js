// src/services/axiosInstance.js (最穩定版本)

import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // 🚀 關鍵 1: 正常靜態導入 useAuthStore 函式
import router from '@/router'; // 如果您有獨立的 router 實例，也建議引入

let isAlerting = false; // 用於防止多次彈出警告

const axiosInstance = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
    // ✅ 確保 Session 模式的關鍵設定
    withCredentials: true 
});

/**
 * 請求攔截器 (保持原樣，不需傳遞 JWT)
 */
axiosInstance.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * 響應攔截器：統一處理 401 錯誤
 */
axiosInstance.interceptors.response.use(response => response, error => {
    
    // 🚀 關鍵 2: 在攔截器內部，直接呼叫 useAuthStore() 取得實例
    // 這是 Pinia 在 Vue 應用程式中推薦的用法。
    // 由於攔截器只在 API 請求發生時運行，這比在模組頂層呼叫安全得多。
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
        // 取得 Pinia 實例
        const authStore = useAuthStore();
        
        console.error("Session Unauthorized or Expired. Logging out...");
        
        if (!isAlerting) {
            isAlerting = true;
            alert('您的登入狀態已失效或無效，請重新登入。');
            
            // 執行登出並導航
            authStore.logout(); 
            // 由於 authStore.logout() 內部可能跳轉，這裡再強制導航到登入頁
            router.push('/login'); 
            
            // 延遲重設旗幟，避免多次彈窗
            setTimeout(() => { isAlerting = false; }, 1000);
        }
    }
    
    return Promise.reject(error);
});

export default axiosInstance;