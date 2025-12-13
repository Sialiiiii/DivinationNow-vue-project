<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  // ⭐ 新增：接收父組件傳入的狀態選項
  careerStatuses: {
    type: Array,
    default: () => []
  },
  relationshipStatuses: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update-profile']);

// 編輯模式開關
const isEditing = ref(false);

// 用於儲存編輯中的數據，避免直接修改 props
const editableUser = ref({});

// 監聽 props.user 變化，同步到 editableUser
watch(() => props.user, (newUser) => {
  // 當 props 改變時（例如 API 更新成功），同步數據
  if (!isEditing.value) {
    editableUser.value = { ...newUser };
  }
}, { immediate: true, deep: true });


// 進入編輯模式
const startEdit = () => {
  // 將當前 user 數據淺複製到編輯狀態
  editableUser.value = { ...props.user };
  isEditing.value = true;
};

// 儲存並發送更新事件給父組件
const saveProfile = () => {
  const payload = {
    username: editableUser.value.username,
    gender: editableUser.value.gender,
    careerStatusId: editableUser.value.careerStatusId,
    relationshipStatusId: editableUser.value.relationshipStatusId
  };
  
  // 發送事件給父組件，讓父組件處理 PATCH API 請求
  emit('update-profile', payload);
  
  // 保持在編輯模式，直到父組件收到 API 成功回應並更新 props.user
  isEditing.value = false;
};

// 取消編輯，並恢復數據
const cancelEdit = () => {
  isEditing.value = false;
  // 恢復到 props.user 的原始數據
  editableUser.value = { ...props.user }; 
};
</script>


<template>
  <div class="user-card">
    <div class="card-header">
      <h4>歡迎回來， {{ user.username }}</h4>
      <button v-if="!isEditing" @click="startEdit" class="edit-btn">編輯資料</button>
      <button v-else @click="saveProfile" class="save-btn">儲存</button>
      <button v-if="isEditing" @click="cancelEdit" class="cancel-btn">取消</button>
    </div>

    <div v-if="!isEditing" class="display-mode">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>性別:</strong> {{ user.gender || '未填寫' }}</p>
      <p><strong>事業狀態:</strong> {{ user.careerStatusName || '未設定' }}</p>
      <p><strong>感情狀態:</strong> {{ user.relationshipStatusName || '未設定' }}</p>
      <p><strong>加入時間：</strong> {{ user.memberSince }}</p>
    </div>

    <div v-else class="edit-mode">
      <div class="field-group">
        <label>暱稱:</label>
        <input type="text" v-model="editableUser.username" />
      </div>

      <div class="field-group">
        <label>生理性別:</label>
        <select v-model="editableUser.gender">
          <option value="Male">男性</option>
          <option value="Female">女性</option>
        </select>
      </div>

      <div class="field-group">
        <label>事業狀態:</label>
        <select v-model="editableUser.careerStatusId">
          <option :value="null">請選擇事業狀態</option> 
          <option v-for="status in careerStatuses" :key="status.id" :value="status.id">
            {{ status.value }}
          </option>
        </select>
      </div>

      <div class="field-group">
        <label>感情狀態:</label>
        <select v-model="editableUser.relationshipStatusId">
          <option :value="null">請選擇感情狀態</option>
          <option v-for="status in relationshipStatuses" :key="status.id" :value="status.id">
            {{ status.value }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* 保持現有樣式... */
.user-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.user-card h4 {
  margin-top: 0;
  color: #333;
}
/* 新增樣式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.edit-btn, .save-btn, .cancel-btn {
  padding: 8px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.edit-btn {
  background-color: #007bff;
  color: white;
}
.save-btn {
  background-color: #28a745;
  color: white;
}
.cancel-btn {
  background-color: #6c757d;
  color: white;
}
.field-group {
  margin-bottom: 10px;
}
.field-group label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
}
.field-group input, .field-group select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}
</style>