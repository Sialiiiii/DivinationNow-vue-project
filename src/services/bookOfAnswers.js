import axios from 'axios';

// 注意：這裡的 API_URL 應該指向您的後端服務。
const API_URL = '/api/divination';

/**
 * 抓取解答之書的所有答案
 * @returns {Promise<Array<{answer_id: number, answer_content: string, created_at: string}>>}
 */
export const getBookAnswers = async () => {
    try {
        // 🚀 修正 1: 修正 API 路徑以匹配 Spring Boot Controller 的 @GetMapping("/bookofanswers")
        const res = await axios.get(`${API_URL}/bookofanswers`);
        
        // 🚀 修正 2: 處理資料轉換 (將駝峰命名轉換為下劃線命名)
        // Spring Boot Entity 輸出為駝峰命名 (answerContent, id, createdAt)。
        // Vue Component 期待下劃線命名 (answer_content, answer_id, created_at)。
        return res.data.map(item => ({
            answer_id: item.id,
            answer_content: item.answerContent,
            created_at: item.createdAt
        }));

    } catch (err) {
        console.error("Error fetching book answers:", err);
        throw err;
    }
};