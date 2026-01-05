import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; 
import router from '@/router';

let isAlerting = false;

const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // 允許攜帶 Cookie
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
    
    if (status === 401) {
        const authStore = useAuthStore();
        
        console.error("Session Unauthorized or Expired. Logging out...");
        
        if (!isAlerting) {
            isAlerting = true;
            alert('您的登入狀態已失效或無效，請重新登入。');
            
            authStore.logout(); 
            
            const currentPath = window.location.pathname;

            if (currentPath.includes('/admin')) {
                router.push('/admin/login'); 
            } else {
                router.push('/login'); 
            }
            setTimeout(() => { isAlerting = false; }, 1000); // 避免1秒內重複彈窗
        }
    }
    
    return Promise.reject(error);
});

export default axiosInstance;