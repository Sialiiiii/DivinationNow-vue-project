import axiosInstance from './axiosInstance';

const API_URL = '/divination'; 

/**
 * [GET] 獲取所有盧恩符文的正逆位資料
 * @returns {Promise<Array<Object>>} 預期返回符文資料陣列
 */
export const fetchRuneData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/runesone`);
        return response.data.map(item => ({
            orientation_id: item.orientationId, 
            rune_id: item.runeId,             
            is_reversed: item.isReversed,     
            full_name_en: item.fullNameEn,    
            full_name_zh: item.fullNameZh,    
            rune_general_meaning: item.runeGeneralMeaning, 
            rune_image_url: item.runeImageUrl, 
        })); 
    } catch (err) {
        console.error("Error fetching runes data:", err);
        throw err;
    }
};

/**
 * [POST] 記錄盧恩單顆占卜結果
 */
export const saveRuneLog = async (orientationId) => { 
    try {
        const payload = { orientation_id: orientationId };
        
        const response = await axiosInstance.post(`${API_URL}/runesone/log`, payload);
        return response.data; 
    } catch (err) {
        console.error("Error saving rune log:", err);
        throw err;
    }
};