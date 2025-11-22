import axios from 'axios';

const API_URL = '/api/auth'; // 透過 Vite proxy 轉發

export const register = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/register`, userData);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err; // 拋給前端處理
    }
};

export const login = async (loginData) => {
    try {
        const res = await axios.post(`${API_URL}/login`, loginData);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

