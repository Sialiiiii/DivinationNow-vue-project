// 🚀 CRITICAL FIX: 修正 import 語法，並假設 axiosInstance.js 在同一個資料夾 (./)
import axiosInstance from './axiosInstance'; 

// 🚀 修正點：移除 /api 前綴，因為 axiosInstance 的 baseURL 已經處理了
const API_URL = '/divination'; 

/**
 * 獲取所有六十甲子籤的內容
 */
export const fetchFortuneStickJiaziData = async () => {
    try {
        // 🚀 使用 axiosInstance 實例
        const response = await axiosInstance.get(`${API_URL}/fortunestickjiazi`);
        
        // 確保數據映射邏輯正確
        return response.data.map(item => ({
            id: item.jiaziSignId, 
            number: String(item.signNumber).padStart(2, '0'), 
            title: `第 ${item.signNumber} 籤`,
            theme: item.meaningCore, 
            text: item.poeticVerse, 
            detail: item.meaningDetail, 
            imageUrl: item.imageUrl, 
        }));

    } catch (err) {
        console.error("Error fetching fortune stick data:", err);
        throw err;
    }
};

/**
 * [POST] 記錄六十甲子籤占卜結果
 */
export const saveJiaziSignLog = async (signId) => {
    try {
        const payload = { sign_id: signId, };
        
        // 🚀 使用 axiosInstance 實例
        const response = await axiosInstance.post(`${API_URL}/fortunestickjiazi/log`, payload);
        return response.data; 
    } catch (err) {
        console.error("Error saving jiazi sign log:", err);
        throw err;
    }
};