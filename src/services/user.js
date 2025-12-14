import axiosInstance from './axiosInstance';

const API_URL = '/user'; // 對應後端 UserController 的 @RequestMapping("/user")

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
        // 對應後端 GET /user/statuses
        const response = await axiosInstance.get(`${API_URL}/statuses`);
        return response.data;
    } catch (err) {
        console.error("Fetch statuses API failed:", err);
        throw err;
    }
};

/**
 * [PATCH] 更新會員資料（暱稱、性別、狀態 ID）
 * @param {object} payload - 包含要更新欄位的物件 (e.g., { username: '新暱稱', careerStatusId: 5 })
 */
export const updateProfile = async (payload) => {
    try {
        // 對應後端 PATCH /user/profile
        const response = await axiosInstance.patch(`${API_URL}/profile`, payload);
        // 成功後，後端返回最新的 UserResponse DTO
        return response.data;
    } catch (err) {
        console.error("Update profile API failed:", err);
        throw err;
    }
};