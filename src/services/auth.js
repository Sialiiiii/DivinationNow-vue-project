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
 * [POST] 處理會員登入
 */
export const login = async (email, password) => {
    try {
        const payload = { email, password }; 
        const formData = qs.stringify(payload);
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