<script setup>
import { ref } from 'vue';
import { register } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const fullName = ref('');
const gender = ref('');
const birthday = ref('');
const careerStatus = ref('');
const relationshipStatus = ref('');
const registerError = ref('');
const registerSuccess = ref('');

const handleRegister = async () => {
  registerError.value = '';
  registerSuccess.value = '';

  if (password.value !== confirmPassword.value) {
    registerError.value = '密碼與確認密碼不一致！';
    return;
  }

  const requiredFields = [
    email.value, password.value, confirmPassword.value,
    fullName.value, gender.value, birthday.value,
    careerStatus.value, relationshipStatus.value
  ];

  if (requiredFields.some(field => !field)) {
    registerError.value = '請填寫所有必填欄位！';
    return;
  }

  try {
    const userData = {
      email: email.value,
      passwordHash: password.value,
      confirmPassword: confirmPassword.value,
      fullName: fullName.value,
      gender: gender.value,
      birthday: birthday.value,
      careerStatus: careerStatus.value,
      relationshipStatus: relationshipStatus.value
    };

    const response = await register(userData);
    console.log('Register successful:', response);
    registerSuccess.value = '註冊成功！您可以登入開始心靈旅行了。';

    setTimeout(() => router.push('/login'), 1500);
  } catch (error) {
    console.error('Register failed:', error);
    if (error.response) {
      const status = error.response.status;
      if (status === 409) registerError.value = '此 Email 已被使用';
      else if (status === 400) registerError.value = '請求資料格式不正確';
      else registerError.value = `伺服器錯誤 (${status})`;
    } else {
      registerError.value = '網路錯誤，請稍後再試';
    }
  }
};
</script>




<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2>註冊成為命運的旅人</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email (帳號)</label>
          <input type="email" id="email" v-model="email" required>
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required>
        </div>

        <div class="form-group">
          <label for="confirmPassword">確認密碼</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        </div>

        <div class="form-group">
          <label for="fullName">姓名</label>
          <input type="text" id="fullName" v-model="fullName" required>
        </div>

        <div class="form-group">
          <label for="birthday">生日</label>
          <input type="date" id="birthday" v-model="birthday" required>
        </div>

        <div class="form-group radio-section compact-radio">
          <label class="radio-label-main">生理性別</label>
          <div class="radio-options-group">
            <input type="radio" id="genderMale" value="男" v-model="gender" name="gender" required>
            <label for="genderMale">男</label>
            
            <input type="radio" id="genderFemale" value="女" v-model="gender" name="gender" required>
            <label for="genderFemale">女</label>
          </div>
        </div>
        
        <div class="form-group radio-section compact-radio">
          <label class="radio-label-main">事業狀態</label>
          <div class="radio-options-group">
            <input type="radio" id="careerEmployed" value="就業中" v-model="careerStatus" name="careerStatus" required>
            <label for="careerEmployed">就業中</label>
            
            <input type="radio" id="careerUnemployed" value="待業" v-model="careerStatus" name="careerStatus" required>
            <label for="careerUnemployed">職涯探索中</label>
            
            <input type="radio" id="careerStudent" value="學生" v-model="careerStatus" name="careerStatus" required>
            <label for="careerStudent">學生</label>

            <input type="radio" id="careerOther" value="其他" v-model="careerStatus" name="careerStatus" required>
            <label for="careerOther">其他</label>
          </div>
        </div>

        <div class="form-group radio-section compact-radio">
          <label class="radio-label-main">感情狀態</label>
          <div class="radio-options-group">
            <input type="radio" id="relMarried" value="已婚" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relMarried">已婚</label>
            
            <input type="radio" id="relStable" value="穩交" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relStable">穩定交往</label>
            
            <input type="radio" id="relAmbiguous" value="曖昧" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relAmbiguous">曖昧</label>
            
            <input type="radio" id="relSingle" value="單身" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relSingle">單身</label>
          </div>
        </div>

        <button type="submit">確認送出</button>
      </form>
      <p>
        已經是會員？ <router-link to="/login">登入</router-link>
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