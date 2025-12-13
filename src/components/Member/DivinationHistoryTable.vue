<template>
  <table class="history-table">
    <thead>
      <tr>
        <th>占卜時間</th>
        <th>占卜方式</th>
        <th>占卜結果 (抽到的牌/籤名)</th>
        <th>核心解釋</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in records" :key="record.id">
        
        <td>{{ record.time }}</td> 
        
        <td>{{ record.method }}</td>
        
        <td>{{ record.result }}</td>
        
        <td class="interpretation-column" :title="record.interpretation">
          {{ record.interpretation }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps } from 'vue'; // ⭐ 移除了不需要的 ref, defineEmits, emit, 編輯相關邏輯

const props = defineProps({
  records: {
    type: Array,
    required: true
  }
});

// ⭐ 移除了所有與編輯問題相關的變數和方法 (isEditing, editingQuestion, startEdit, saveQuestion)
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

/* ⭐ 新增/修正：整潔模式樣式 - 用於核心解釋欄位 ⭐ */
.interpretation-column {
  /* 限制寬度，讓表格不會過於寬大 */
  max-width: 350px; 
  /* 關鍵：強制文本在同一行顯示，超出的部分隱藏 */
  white-space: nowrap; 
  overflow: hidden;
  /* 關鍵：超出的部分顯示省略號 */
  text-overflow: ellipsis; 
  /* 讓用戶將滑鼠停留在欄位上時，可以顯示完整的解釋文本 (使用 :title 綁定) */
  cursor: help; 
}
</style>