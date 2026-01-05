import axios from 'axios';

const API_URL = '/api/divination';

/**
 * 抓取解答之書的所有答案
 * @returns {Promise<Array<{answer_id: number, answer_content: string, created_at: string}>>}
 */
export const getBookAnswers = async () => {
    try {
        const res = await axios.get(`${API_URL}/bookofanswers`);
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