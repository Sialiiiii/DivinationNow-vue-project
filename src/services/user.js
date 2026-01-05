import axiosInstance from './axiosInstance';

const API_URL = '/user';

/**
 * [GET] 獲取當前登入用戶的會員資料 (包含所有狀態名稱)
 */
export const fetchMemberData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/profile`);
        return response.data;
    } catch (err) {
        console.error("Fetch profile API failed:", err);
        throw err;
    }
};

/**
 * [GET] 獲取所有狀態選項 (事業/感情)，供下拉選單使用
 */
export const fetchAllStatuses = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/statuses`);
        return response.data;
    } catch (err) {
        console.error("Fetch statuses API failed:", err);
        throw err;
    }
};

/**
 * [PATCH] 更新會員資料（暱稱、性別、狀態 ID）
 * @param {object} payload
 */
export const updateProfile = async (payload) => {
    try {
        const response = await axiosInstance.patch(`${API_URL}/profile`, payload);
        return response.data;
    } catch (err) {
        console.error("Update profile API failed:", err);
        throw err;
    }
};