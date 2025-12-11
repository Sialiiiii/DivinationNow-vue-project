<script setup>
import { ref } from 'vue';
import { login as apiLogin } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const loginError = ref('');
const loginSuccess = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  loginError.value = '';
  loginSuccess.value = '';

//   try {
//     // 🚀 修正點：直接將 email 和 password 作為單獨參數傳遞給 apiLogin
//     const userData = await apiLogin(email.value.trim(), password.value); 

//     // 關鍵修正 2: 檢查返回數據中是否包含 User ID
//     if (userData && userData.id) {
//       console.log('登入成功，User ID:', userData.id);
//       loginSuccess.value = userData.message || '登入成功！';

//       // 關鍵修正 3: 呼叫 store 的 login action，傳遞 User 數據
//       authStore.login(userData); 
//       // Pinia store 內有邏輯導向 /member-profile
//     
//     } else {
//         // 登入 API 雖然返回 200，但數據結構不對
//         loginError.value = '登入失敗，伺服器響應的會員數據無效。';
//       }
//   } catch (error) {
//     console.error('登入錯誤', error);
//     
//     if (error.response) {
//       // 錯誤處理：優先顯示後端傳遞的錯誤訊息
//       let errorMessage = error.response.data.message || `伺服器錯誤 (${error.response.status})`;
//       
//       // 處理 Spring Security 默認的 401 響應（通常沒有 body）
//       if (error.response.status === 401 && !error.response.data) {
//         errorMessage = '帳號或密碼錯誤，請重新嘗試。';
//       }
//       // 處理 403 錯誤
//       if (error.response.status === 403) {
//         errorMessage = '權限不足或登入資訊無效，請檢查帳號密碼。';
//       }
//       
//       loginError.value = errorMessage;
//     } else {
//       loginError.value = '網路錯誤，請檢查後端服務是否運行。';
//     }
//   }
// };

try {
    const userData = await apiLogin(email.value.trim(), password.value); 

    // 登入 API 成功，通常 Spring Security 不會返回 userData，
    // 但如果您的自定義 successHandler 有返回，則使用它
    if (userData) {
      console.log('登入成功，User Data:', userData);
      loginSuccess.value = '登入成功！正在跳轉...';

      // 🚀 關鍵修正：獲取 redirect 參數 (用於返回被保護頁面)
      const redirectPath = router.currentRoute.value.query.redirect || '/'; 

      // 呼叫 store 的 login action，傳遞 User 數據和目標路徑
      authStore.login(userData, redirectPath); 
    
    } else {
      // 如果 Spring Security 只返回 200/204 但沒有 body，我們假設成功
      loginSuccess.value = '登入成功！正在跳轉...';
      const redirectPath = router.currentRoute.value.query.redirect || '/'; 
      authStore.login({ id: 'unknown' }, redirectPath); // 使用假數據觸發登入狀態
    }

  } catch (error) {
    console.error('登入錯誤', error);
    // ... (錯誤處理邏輯與您提供的原始碼相同)
    if (error.response) {
      let errorMessage = error.response.data.message || `伺服器錯誤 (${error.response.status})`;
      
      if (error.response.status === 401 || error.response.status === 403) {
        errorMessage = '帳號或密碼錯誤，請重新嘗試。';
      }
      
      loginError.value = errorMessage;
    } else {
      loginError.value = '網路錯誤，請檢查後端服務是否運行。';
    }
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>準備好探索心靈</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">帳號</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <p v-if="loginError" style="color: red; margin-top: 10px;">{{ loginError }}</p>
        <p v-if="loginSuccess" style="color: green; margin-top: 10px;">{{ loginSuccess }}</p>
        
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


<style>
  :root {
      --color-light-text: #ffffff;
      --color-dark-text: #2b3a67;
      --color-accent-light: #c7e4ff;
      --color-shadow-soft: rgba(255, 255, 255, 0.2);
      --color-shadow-glow: rgba(255, 255, 255, 0.8);
      --color-form-bg: rgba(255, 255, 255, 0.1);
      --color-input-bg: rgba(0, 0, 0, 0.1);
  }

  /* 容器佈局 */
  .auth-container {
      display: flex;
      justify-content: center; 
      align-items: center; 
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #e0f2f7 0%, #a4c2d6 50%, #7d96a8 100%);
  }

  /* 表單卡片*/
  .auth-form {
      width: 100%;
      max-width: 420px; 
      padding: 30px;
      background: var(--color-form-bg); 
      backdrop-filter: blur(10px); 
      -webkit-backdrop-filter: blur(10px);
      
      border: 1px solid rgba(255, 255, 255, 0.3); 
      border-radius: 12px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); 
      color: var(--color-dark-text);
      box-sizing: border-box;
      text-align: center;
  }

  /* 標題 */
  .auth-form h2 {
      color: var(--color-dark-text);
      margin-top: 15px; 
      margin-bottom: 25px;
      font-size: 2em;
      text-shadow: 0 0 5px var(--color-shadow-soft);
  }

  /* 輸入欄位樣式 */
  .form-group {
      margin-bottom: 12px; 
      display: flex;
      flex-direction: column;
      text-align: left;
  }

  .form-group label {
      font-size: 0.9em;
      margin-bottom: 5px;
      color: var(--color-dark-text);
      font-weight: 600;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="password"],
  .form-group input[type="date"] {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--color-dark-text); 
      border-radius: 6px;
      background-color: var(--color-input-bg); 
      color: var(--color-light-text);
      box-sizing: border-box;
      transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-group input:focus {
      outline: none;
      border-color: var(--color-light-text);
      box-shadow: 0 0 10px var(--color-shadow-soft); 
  }

  /* 單選群組排版 */
  .radio-section .radio-label-main {
      color: var(--color-dark-text);
  }

  .radio-options-group label {
      color: var(--color-dark-text);
  }


  /* 註冊按鈕樣式設計 */
  button[type="submit"] {
      width: 100%;
      margin-top: 25px;
      padding: 12px;
      
      background: transparent; 
      color: var(--color-light-text); 
      font-weight: 600;
      
      border: 2px solid var(--color-light-text); 
      border-radius: 8px; 
      cursor: pointer;
      font-size: 1.1em;
      
      box-shadow: 0 0 15px var(--color-shadow-glow), 0 0 25px var(--color-shadow-glow);
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.1s;
  }

  button[type="submit"]:hover {
      background: rgba(255, 255, 255, 0.1); 
      box-shadow: 0 0 20px var(--color-shadow-glow), 0 0 30px var(--color-shadow-glow);
      transform: translateY(-1px); 
  }

  /* 回到首頁按鈕 */
  .auth-form .home-link-button {
      display: block;
      width: fit-content; 
      margin: 0 auto 20px auto; 
      padding: 8px 15px;
      
      background: transparent; 
      color: var(--color-dark-text); 
      border: 1px solid var(--color-dark-text);
      border-radius: 20px; 
      text-decoration: none; 
      font-size: 0.9em;
      font-weight: 500;
      transition: background 0.3s, border-color 0.3s;
  }

  .auth-form .home-link-button:hover {
      background: rgba(43, 58, 103, 0.1);
      box-shadow: none; 
  }

  /* 登入連結文字 */
  .auth-form p {
      margin-top: 25px; 
      font-size: 0.9em;
      color: var(--color-dark-text); 
  }

  .auth-form p a {
      color: var(--color-dark-text); 
      text-decoration: none;
      font-weight: 600;
      text-shadow: none;
  }

  .auth-form p a:hover {
      color: var(--color-dark-text);
      text-decoration: underline;
  }
</style>