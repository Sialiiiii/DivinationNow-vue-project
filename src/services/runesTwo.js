import axiosInstance from './axiosInstance';

const API_URL = '/divination'; 

/**
 * [GET] 獲取符文特定解讀，對應 specific_rune_readings
 * @param {number} orientationId
 * @param {number} statusId
 * @param {number} position
 * @returns {Promise<{ interpretation_text: string, ... }>} 
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
        
        return { 
            interpretation_text: response.data.interpretationText 
        }; 
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return { interpretation_text: null }; 
        }
        console.error("Error fetching specific rune reading:", err);
        throw err;
    }
};


/**
 * [POST] 記錄盧恩雙顆占卜結果，寫入 rune_double_logs
 * @param {number} rune1OrientationId
 * @param {number} rune2OrientationId
 * @param {number} statusId
 * @returns {Promise<DivinationLog>} 
 */
export const saveRuneDoubleLog = async (rune1OrientationId, rune2OrientationId, statusId) => { 
    
    let careerId = null;
    let relationshipId = null;

    if (statusId >= 1 && statusId <= 4) { 
        careerId = statusId;
    } else if (statusId >= 5 && statusId <= 8) { 
        relationshipId = statusId;
    }
    
    const payload = {
        rune1_specific_reading_id: rune1OrientationId, 
        rune2_specific_reading_id: rune2OrientationId,
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