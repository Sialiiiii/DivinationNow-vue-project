import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; 
import router from '@/router';

let isAlerting = false; // 防止多次彈出警告

const axiosInstance = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
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
 * 響應攔截器：統一處理 401 錯誤
 */
axiosInstance.interceptors.response.use(response => response, error => {
    
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
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