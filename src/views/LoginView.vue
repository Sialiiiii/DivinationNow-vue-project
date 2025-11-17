<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>登入</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">帳號</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">登入</button>
      </form>
      <p>
        還不是會員嗎？ <router-link to="/register">註冊</router-link>
      </p>
      <p>
        <router-link to="/">回到首頁</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@/assets/styles/auth.css';

const username = ref('');
const password = ref('');

const handleLogin = () => {
  // 在這裡處理登入邏輯
  console.log('Login attempt with:', username.value, password.value);
  alert(`登入帳號: ${username.value}`);
};
</script>
