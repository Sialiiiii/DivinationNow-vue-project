import axiosInstance from './axiosInstance';

const API_URL = '/divination'; 

/**
 * [GET] 獲取符文特定解讀 (對應 specific_rune_readings)
 * 這是雙顆符文最主要的 API 呼叫點。
 * @param {number} orientationId - 符文正逆位 ID (rune_orientation_id)
 * @param {number} statusId - 狀態 ID (user_career_status_id 或 user_relationship_status_id)
 * @param {number} position - 牌位 (1=現況/基礎, 0=建議/指引)
 * @returns {Promise<{ interpretation_text: string, ... }>} 預期返回特定解讀物件
 */
export const fetchSpecificRuneReading = async (orientationId, statusId, position) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/runes/reading`, {
            params: {
                orientation_id: orientationId,
                status_id: statusId,
                is_current_status_position: position
            }
        });
        
        // 預期後端返回 SpecificRuneReading 物件
        return { 
            interpretation_text: response.data.interpretationText 
        }; 
    } catch (err) {
        if (err.response && err.response.status === 404) {
             // 如果後端返回 404 (找不到特定解讀)，我們返回 null 訊息，讓 Vue 組件 fallback
            return { interpretation_text: null }; 
        }
        console.error("Error fetching specific rune reading:", err);
        throw err;
    }
};


/**
 * [POST] 記錄盧恩雙顆占卜結果 (寫入 rune_double_logs)
 * 註：後端 Controller 會將這兩個 ID 寫入 rune_double_logs
 * @param {number} userId - 登入者的 user_id
 * @param {number} rune1OrientationId - 第一張牌 (現況/基礎) 的 orientation_id
 * @param {number} rune2OrientationId - 第二張牌 (建議/指引) 的 orientation_id
 * @param {number} statusId - 使用者選擇的狀態 ID (來自 divStore.chosenStatus)
 * @returns {Promise<{ message: string, log_id: number }>} 
 */
export const saveRuneDoubleLog = async (userId, rune1OrientationId, rune2OrientationId, statusId) => {
    
    let careerId = null;
    let relationshipId = null;

    // 🚀 關鍵修正點：根據 statuses 表格 ID 範圍假設 (1-4 事業, 5-8 感情) 進行分配
    // 這是前端 Service 必須進行的業務判斷，以匹配後端 Entity 欄位
    if (statusId >= 1 && statusId <= 4) { 
        careerId = statusId;
    } else if (statusId >= 5 && statusId <= 8) { 
        relationshipId = statusId;
    }
    
    const payload = {
        user_id: userId,
        rune1_orientation_id: rune1OrientationId,
        rune2_orientation_id: rune2OrientationId,
        user_career_status_id: careerId, 
        user_relationship_status_id: relationshipId,
    };
    
    try {
        const response = await axiosInstance.post(`${API_URL}/runes/double-log`, payload);
        return response.data; 
    } catch (err) {
        console.error("Error saving rune double log:", err);
        throw err;
    }
};