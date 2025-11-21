<template>
  <table class="history-table">
    <thead>
      <tr>
        <th>占卜方式</th>
        <th>占卜結果</th>
        <th>占卜時間</th>
        <th>所問問題</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in records" :key="record.id">
        <td>{{ record.method }}</td>
        <td>{{ record.result }}</td>
        <td>{{ record.time }}</td>
        
        <td>
          <span v-if="!isEditing[record.id]">
            {{ record.question || '（點擊新增問題）' }}
          </span>
          <input 
            v-else
            type="text"
            v-model="editingQuestion[record.id]"
            @keyup.enter="saveQuestion(record)"
            placeholder="請輸入您當時所問的問題"
            class="question-input"
          />
        </td>

        <td>
          <button 
            v-if="!isEditing[record.id]" 
            @click="startEdit(record)"
            class="edit-btn"
          >
            {{ record.question ? '修改' : '新增' }}
          </button>
          <button 
            v-else 
            @click="saveQuestion(record)"
            class="save-btn"
          >
            儲存
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  records: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update-question']);

// 局部狀態：追蹤哪個 record 正在被編輯
const isEditing = ref({}); 
// 局部狀態：儲存正在編輯中的問題文字
const editingQuestion = ref({}); 

// 點擊「新增/修改」按鈕時
const startEdit = (record) => {
  // 1. 設定當前 record 進入編輯模式
  isEditing.value[record.id] = true;
  // 2. 將原始問題載入到輸入框狀態中
  editingQuestion.value[record.id] = record.question; 
};

// 點擊「儲存」按鈕或按下 Enter 時
const saveQuestion = (record) => {
  const newQuestion = editingQuestion.value[record.id];
  
  if (newQuestion !== record.question) {
    // 3. 發出事件給父組件，讓父組件處理 API 更新
    emit('update-question', {
      id: record.id,
      question: newQuestion,
    });
  }

  // 4. 退出編輯模式並清除編輯狀態
  isEditing.value[record.id] = false;
  delete editingQuestion.value[record.id];
};
</script>

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
.question-input {
  width: 90%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.edit-btn, .save-btn {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
.edit-btn {
  background-color: #4CAF50;
  color: white;
}
.save-btn {
  background-color: #008CBA;
  color: white;
}
</style>