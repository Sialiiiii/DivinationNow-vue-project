import axiosInstance from './axiosInstance';
import qs from 'qs';

const API_URL = '/auth';

/**
 * [POST] 處理會員註冊
 */
export const register = async (userData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (err) {
        console.error("Register API failed:", err);
        throw err;
    }
};

/**
 * [POST] 處理會員登入 (Session 模式)
 */
export const login = async (email, password) => {
    try {
        const payload = { email, password }; 

        // 🚀 關鍵修正 1: 將 JSON 物件轉換為 application/x-www-form-urlencoded 格式
        const formData = qs.stringify(payload);
        
        // 🚀 關鍵修正 2: 設置 Content-Type 為 Form Data 類型
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const response = await axiosInstance.post(`${API_URL}/login`, formData, config);
        
        return response.data; 
    } catch (err) {
        console.error("Login API failed:", err);
        throw err;
    }
};