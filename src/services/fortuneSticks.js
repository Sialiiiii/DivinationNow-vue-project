import axiosInstance from './axiosInstance'; 

const API_URL = '/divination'; 

/**
 * [GET] 獲取所有六十甲子籤內容
 */
export const fetchFortuneStickJiaziData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/fortunestickjiazi`);
        
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
        
        const response = await axiosInstance.post(`${API_URL}/fortunestickjiazi/log`, payload);
        return response.data; 
    } catch (err) {
        console.error("Error saving jiazi sign log:", err);
        throw err;
    }
};