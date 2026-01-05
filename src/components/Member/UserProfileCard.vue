<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
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
const isEditing = ref(false);
const editableUser = ref({});


watch(() => props.user, (newUser) => {
  if (!isEditing.value) {
    editableUser.value = { ...newUser };
  }
}, { immediate: true, deep: true });


const startEdit = () => {
  editableUser.value = { ...props.user };
  isEditing.value = true;
};

const saveProfile = () => {
  const payload = {
    username: editableUser.value.username,
    gender: editableUser.value.gender,
    careerStatusId: editableUser.value.careerStatusId,
    relationshipStatusId: editableUser.value.relationshipStatusId
  };
  
  emit('update-profile', payload);

  isEditing.value = false;
};


const cancelEdit = () => {
  isEditing.value = false;
  editableUser.value = { ...props.user }; 
};
</script>


<template>
  <div class="user-card">
    <div class="card-header">
      <h4>歡迎回來， {{ user.username }}</h4>
      <div class="card-headerbutton">
        <button v-if="!isEditing" @click="startEdit" class="edit-btn">編輯資料</button>
        <button v-else @click="saveProfile" class="save-btn">儲存</button>
        <button v-if="isEditing" @click="cancelEdit" class="cancel-btn">取消</button>
      </div>
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
          <option value="Male">男</option>
          <option value="Female">女</option>
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
.user-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.user-card h4 {
  font-size: 18px;
  margin-top: 0;
  color: #333;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-headerbutton{
  display: flex;
  justify-content: flex-start;
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
  background-color: #747474;
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