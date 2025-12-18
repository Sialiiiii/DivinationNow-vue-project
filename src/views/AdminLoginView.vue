<script setup>
import { ref } from 'vue';
import axiosInstance from '@/services/axiosInstance';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref(''); 
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleAdminLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // ⭐ 修正點 1：使用 URLSearchParams 將 JSON 物件轉換為 x-www-form-urlencoded 格式
    const loginData = new URLSearchParams();
    loginData.append('email', username.value); // Spring Security 預期的參數名
    loginData.append('password', password.value); // Spring Security 預期的參數名

    const response = await axiosInstance.post('/auth/login', 
      loginData, // ⭐ 傳送轉換後的數據
      {
        // ⭐ 修正點 2：覆蓋預設的 Content-Type，讓後端識別為表單數據
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.status === 200 && response.data.role === 'ADMIN') {
      alert('管理員登入成功！');
      localStorage.setItem('user_role', 'ADMIN');
      router.push('/admin/dashboard');
    }
  } catch (error) {
    isLoading.value = false;
    // 處理登入失敗訊息
    const message = error.response?.data?.message || '登入失敗，請檢查帳號和密碼。';
    errorMessage.value = message;
    console.error('Admin Login Error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="admin-login-container">
    <div class="login-card">
      <h2>🔑 管理員登入</h2>
      <p class="login-tip">請使用您的管理員專屬帳號登入</p>
      
      <form @submit.prevent="handleAdminLogin">
        <div class="input-group">
          <label for="username">管理員帳號</label>
          <input type="text" id="username" v-model="username" required :disabled="isLoading">
        </div>
        
        <div class="input-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required :disabled="isLoading">
        </div>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '登入中...' : '登入管理介面' }}
        </button>
      </form>

      <router-link to="/">返回首頁</router-link>
    </div>
  </div>
</template>

<style scoped>
/* 這裡使用深色調，與管理員權限對應 */
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #36454F; /* 深灰色背景 */
  font-family: 'Microsoft JhengHei', sans-serif;
}

.login-card {
  background-color: #2c3e50; /* 卡片深藍色 */
  color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #ffcc80; /* 突出的黃色 */
}

.login-tip {
    font-size: 0.9rem;
    color: #a0a0a0;
    margin-bottom: 25px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #c0c0c0;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #4a6375;
  border-radius: 6px;
  background-color: #1e2b38;
  color: white;
  font-size: 1rem;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #ffcc80;
  color: #1a1a2e;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #ffb74d;
}

.error-message {
  color: #ff6b6b;
  margin-top: 15px;
  margin-bottom: 15px;
  font-weight: bold;
}

.login-card a {
    display: block;
    margin-top: 20px;
    color: #a3ccff;
    text-decoration: none;
    transition: color 0.3s;
}

.login-card a:hover {
    color: #e0f7fa;
}
</style>