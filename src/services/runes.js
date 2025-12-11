import axios from 'axios';

// 假設占卜 API 基礎路徑
const API_URL = '/api/divination'; 

/**
 * [GET] 抓取所有盧恩符文的正逆位資料 (對應 rune_orientation 表)
 * @returns {Promise<Array<Object>>} 預期返回符文資料陣列
 */
export const fetchRuneData = async () => {
    try {
        // 呼叫後端路由：GET /api/divination/runesone
        const response = await axios.get(`${API_URL}/runesone`);
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
 * [POST] 記錄盧恩單顆占卜結果 (寫入 rune_single_logs 和 divination_logs)
 * 註：後端 RuneOneController 的 /runesone/log 端點負責處理狀態 ID 判斷。
 * @param {number} userId - 登入者的 user_id
 * @param {number} orientationId - 抽到的符文正逆位 ID
 * @param {number | null} statusId - 使用者的狀態 ID (目前單顆占卜暫時傳 null 或 0)
 * @returns {Promise<{ message: string, log_id: number }>} 
 */
export const saveRuneLog = async (userId, orientationId, statusId = null) => {
    try {
        // 假設後端路由：POST /api/divination/runesone/log
        const payload = {
            user_id: userId,
            orientation_id: orientationId,
            // 傳遞 statusId，讓後端去判斷它是事業還是感情
            status_id: statusId || 0, // 預設為 0 或 null (由後端處理)
        };
        
        const response = await axios.post(`${API_URL}/runesone/log`, payload);
        return response.data; 
    } catch (err) {
        console.error("Error saving rune log:", err);
        throw err;
    }
};