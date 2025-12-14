<script setup>
import { defineProps, ref, computed, reactive } from 'vue';
import axios from 'axios'; // ⭐ 必須引入 axios

const props = defineProps({
  records: {
    type: Array,
    required: true
  }
});

// --- 展開/收起邏輯 (保持不變) ---
const expandedId = ref(null);

const toggleExpand = (recordId) => {
  expandedId.value = expandedId.value === recordId ? null : recordId;
};

const isExpanded = (recordId) => {
  return expandedId.value === recordId;
};

// --- 編輯功能狀態 ---
// ⭐ 新增: 響應式狀態，追蹤正在編輯的紀錄 ID 和其問題內容
const editingState = reactive({
    id: null, // 當前正在編輯的 logId
    question: '' // 當前編輯框中的問題文本
});

// --- 編輯功能方法 ---

// ⭐ 新增方法: 啟動編輯模式
const startEdit = (record) => {
    editingState.id = record.id;
    editingState.question = record.question;
};

// ⭐ 新增方法: 取消編輯
const cancelEdit = () => {
    editingState.id = null;
    editingState.question = '';
};

// ⭐ 新增方法: 儲存問題到後端
const saveQuestion = async (record) => {
    // 檢查問題是否為空或未改變
    if (!editingState.question || editingState.question.trim() === record.question) {
        cancelEdit();
        return;
    }
    
    try {
        // API 路徑為 PATCH /divination/history/{logId}
        const response = await axios.patch(`/api/divination/history/${record.id}`, {
            question: editingState.question.trim() 
        });
        
        if (response.status === 200) {
            // 成功後，更新本地數據
            record.question = editingState.question.trim(); 
            alert('問題更新成功！');
        } else {
            alert('更新失敗，請稍後再試。');
        }
    } catch (error) {
        console.error('更新問題 API 失敗:', error);
        alert('更新問題時發生錯誤。');
    } finally {
        cancelEdit(); // 退出編輯模式
    }
};


// --- 計算屬性：解析詳細解釋文本 ---
const parsedDetails = computed(() => {
    if (!expandedId.value) return null;
    
    // 找到當前展開的紀錄
    const record = props.records.find(r => r.id === expandedId.value);
    if (!record || !record.interpretation) return null;
    
    // 使用分隔符號 '|||' 拆分內容 (六十甲子籤)
    const parts = record.interpretation.split('|||');
    
    // 檢查是否為六十甲子籤 (依賴後端使用 ||| 分隔，且占卜方式為中文)
    if (record.method === '六十甲子籤' && parts.length === 3) {
        return {
            isJiazi: true,
            poeticVerse: parts[0].trim(),
            meaningCore: parts[1].trim(),
            meaningDetail: parts[2].trim()
        };
    } 
    // 處理盧恩符文 (假設盧恩是單個大文本，直接返回)
    return { 
        isJiazi: false, 
        rawText: record.interpretation 
    };
});
</script>



<template>
  <table class="history-table">
    <thead>
      <tr>
        <th>占卜時間</th>
        <th>占卜方式</th>
        <th>占卜結果 (抽到的牌/籤名)</th>
        <th>問題敘述</th> <th>核心解釋</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="record in records" :key="record.id">
        
        <tr 
          @click="toggleExpand(record.id)" 
          :class="{'expanded': isExpanded(record.id), 'clickable-row': true}"
        >
            
            <td>{{ record.time }}</td> 
            
            <td>{{ record.method }}</td>
            
            <td>{{ record.result }}</td>
            
            <td class="question-column" @click.stop>
                <div v-if="editingState.id === record.id" class="editing-mode">
                    <input 
                        v-model="editingState.question" 
                        @keyup.enter="saveQuestion(record)"
                        @keyup.esc="cancelEdit"
                        type="text"
                        placeholder="請輸入您的問題"
                    />
                    <button @click="saveQuestion(record)" class="save-btn">保存</button>
                    <button @click="cancelEdit" class="cancel-btn">取消</button>
                </div>
                <div v-else class="display-mode">
                    <span :title="record.question" :class="{'placeholder': !record.question}">
                        {{ record.question || '（點擊右側按鈕填寫問題）' }}
                    </span>
                    <button @click.stop="startEdit(record)" class="edit-btn">✎</button>
                </div>
            </td>
            
            <td class="interpretation-column">
              <div class="summary-text">{{ record.interpretation.substring(0, 40) }}...</div>
              <span class="expand-icon">{{ isExpanded(record.id) ? '▲' : '▼' }}</span>
            </td>
        </tr>
        
        <tr v-if="isExpanded(record.id)" class="detail-row">
          <td colspan="5">
            <div class="detail-content">
              <h4>占卜結果詳細解說</h4>
              
              <div v-if="parsedDetails && parsedDetails.isJiazi" class="jiazi-details">
                <div class="detail-section">
                  <h5>籤詩</h5>
                  <p class="poetic-verse">{{ parsedDetails.poeticVerse }}</p>
                </div>
                
                <div class="detail-section">
                  <h5>核心解說</h5>
                  <p>{{ parsedDetails.meaningCore }}</p>
                </div>
                
                <div class="detail-section">
                  <h5>詳細解說</h5>
                  <p>{{ parsedDetails.meaningDetail }}</p>
                </div>
              </div>
              
              <div v-else-if="parsedDetails && !parsedDetails.isJiazi" class="rune-details">
                <p class="rune-raw-text">{{ parsedDetails.rawText }}</p>
              </div>
              
              <p v-else>無法解析詳細解釋。</p>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<style scoped>
.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.history-table th, .history-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.history-table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

/* --- 行交互與展開樣式 --- */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-row:hover {
  background-color: #e9e9e9;
}
.expanded {
  /* 展開時的背景色 */
  background-color: #fff3e0; 
}

/* --- 問題敘述欄位樣式 (Question) --- */
.question-column {
    min-width: 150px;
    max-width: 250px;
    /* 讓問題欄位內容在單行顯示，超出部分用省略號 */
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
}
.display-mode {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.placeholder {
    color: #999;
    font-style: italic;
    overflow: hidden; 
    text-overflow: ellipsis;
}
.edit-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
    padding: 0 5px;
    flex-shrink: 0; /* 防止按鈕被壓縮 */
}
.edit-btn:hover {
    color: #0056b3;
}

/* 編輯模式樣式 */
.editing-mode {
    display: flex;
    gap: 5px;
    align-items: center;
}
.editing-mode input {
    flex-grow: 1;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 14px;
}
.save-btn, .cancel-btn {
    padding: 3px 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 12px;
}
.save-btn {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}
.cancel-btn {
    background-color: #f0f0f0;
    color: #333;
}


/* --- 核心解釋欄位樣式 (Interpretation Summary) --- */
.interpretation-column {
  max-width: 350px;
  /* 讓單行文本顯示，超出部分省略 */
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
  /* 設置彈性容器以便定位箭頭 */
  display: flex; 
  justify-content: space-between;
  align-items: center;
}

.summary-text {
  /* 讓文本部分截斷 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; 
  padding-right: 10px;
}

.expand-icon {
  margin-left: 5px;
  font-size: 10px;
  color: #007bff;
  flex-shrink: 0;
}

/* --- 展開詳情行樣式 (Detail Row) --- */
.detail-row td {
  padding: 20px 40px; /* 增加左右邊距 */
  background-color: #f8f8f8;
  border-left: none;
  border-right: none;
}
.detail-content h4 {
  margin-top: 0;
  color: #007bff;
  font-size: 1.2em;
  padding-bottom: 5px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 15px;
}

/* 結構化解說區塊樣式 */
.detail-section {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 6px;
  background-color: #ffffff; /* 白色卡片背景 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.detail-section h5 {
  color: #333; 
  font-size: 1.1em;
  margin-top: 0;
  margin-bottom: 10px;
  border-left: 3px solid #ff7e00; /* 橙色強調線 */
  padding-left: 10px;
}
.detail-section p {
  white-space: pre-wrap; /* 確保內容中的換行生效 */
  margin: 0;
  line-height: 1.8;
  color: #555;
}
.poetic-verse {
    font-style: italic;
    font-weight: bold;
}

/* 盧恩符文原始文本顯示 */
.rune-raw-text {
    white-space: pre-wrap;
    padding: 10px;
    border: 1px dashed #ccc;
    background-color: #fff;
}
</style>