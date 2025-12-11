import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 對應MySQL， Status ID (INT) 作為鍵值
const STATUS_MAP = {
    // Career (Type: '事業')
    1: { type: 'Career', value: 'EMPLOYED', label: '就業中' },
    2: { type: 'Career', value: 'UNEMPLOYED', label: '職涯探索中' },
    3: { type: 'Career', value: 'STUDENT', label: '學生' },
    4: { type: 'Career', value: 'OTHER', label: '其他' },
    // Relationship (Type: '感情')
    5: { type: 'Relationship', value: 'MARRIED', label: '已婚' },
    6: { type: 'Relationship', value: 'IN_A_RELATIONSHIP', label: '穩定交往' },
    7: { type: 'Relationship', value: 'COMPLICATED', label: '曖昧' },
    8: { type: 'Relationship', value: 'SINGLE', label: '一個人也很好' },
};


export const useDivinationStore = defineStore('divination', () => {

    const currentTopic = ref(null); // '事業' 或 '感情'
    const chosenStatus = ref(null); // 【修正】儲存 status_id (INT)
    const isReadyToDraw = ref(false); 

    const showTopicModal = ref(false); 
    const showStatusModal = ref(false); 

    /**
     * 計算屬性: 根據當前主題回傳對應的狀態選項列表 (用於未登入時的 Modal)
     */
    const getStatusOptions = computed(() => {
        const topicType = currentTopic.value === '事業' ? 'Career' : 'Relationship';
        
        // 過濾出與主題相關的狀態，並轉換成 { id: 1, label: '就業中', value: 'EMPLOYED' } 的形式
        return Object.keys(STATUS_MAP)
            .filter(id => STATUS_MAP[id].type === topicType)
            .map(id => ({
                id: parseInt(id), // 傳遞 ID 給元件
                label: STATUS_MAP[id].label,
                value: STATUS_MAP[id].value 
            }));
    });

    /**
     * Actions: 設定主題並推進流程
     * @param {string} topic - '事業' 或 '感情'
     */
    function setTopic(topic) {
        currentTopic.value = topic;
        showTopicModal.value = false;
    }

    /**
     * Actions: 設定狀態 ID
     * @param {number} statusId - 具體的狀態 ID (e.g., 1, 3, 5)
     */
    function setStatus(statusId) {
        chosenStatus.value = statusId;
        showStatusModal.value = false;
        isReadyToDraw.value = true;
    }

    /**
     * Actions: 重置占卜流程狀態
     */
    function resetFlow() {
        currentTopic.value = null;
        chosenStatus.value = null;
        isReadyToDraw.value = false;
        showTopicModal.value = false;
        showStatusModal.value = false;
    }
    
    /**
     * 取得狀態的中文標籤 (依賴 statusId)
     */
    function getStatusLabel(statusId) {
        const status = STATUS_MAP[statusId];
        return status ? status.label : '未知狀態';
    }

    /**
     * 取得狀態的英文鍵值 (依賴 statusId)
     */
    function getStatusValue(statusId) {
        const status = STATUS_MAP[statusId];
        return status ? status.value : 'UNKNOWN';
    }

    return { 
        currentTopic, 
        chosenStatus, 
        isReadyToDraw,
        showTopicModal,
        showStatusModal,
        getStatusOptions,
        getStatusLabel,
        getStatusValue, 
        setTopic,
        setStatus,
        resetFlow
    }
})