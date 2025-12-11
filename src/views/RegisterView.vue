<script setup>
  import { ref } from 'vue';
  import { register } from '@/services/auth';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const username = ref('');
  const gender = ref('');
  const dateOfBirth = ref('');
  const careerStatus = ref('');
  const relationshipStatus = ref('');
  const registerError = ref('');
  const registerSuccess = ref('');
  const showSuccessModal = ref(false);

  const mapGenderToBackend = (frontendGender) => {
    switch (frontendGender) {
      case '男': return 'MALE';
      case '女': return 'FEMALE';
      default: return 'PREFER_NOT_TO_SAY';
    }
  };

  // 映射事業狀態 (後端 DTO 接收 careerStatusValue 字串)
  const mapCareerStatusToBackend = (frontendStatus) => {
    switch (frontendStatus) {
      case '就業中': return 'EMPLOYED';
      case '職涯探索中': return 'UNEMPLOYED';
      case '學生': return 'STUDENT';
      case '其他': return 'OTHER';
      default: return ''; 
    }
  };

// 映射感情狀態 (後端 DTO 接收 relationshipStatusValue 字串)
  const mapRelationshipStatusToBackend = (frontendStatus) => {
    switch (frontendStatus) {
      case '已婚': return 'MARRIED';
      case '穩定交往': return 'IN_A_RELATIONSHIP';
      case '曖昧': return 'COMPLICATED';
      case '一個人也很好': return 'SINGLE';
      default: return ''; 
    }
  };

 const handleRegister = async () => {
  registerError.value = '';
  registerSuccess.value = '';

  if (password.value !== confirmPassword.value) {
    registerError.value = '密碼與確認密碼不一致！';
    return;
  }
  
     // 🚀 修正點：將聲明和賦值移動到這裡 (確保在使用前被定義)
     const mappedRelationshipStatus = mapRelationshipStatusToBackend(relationshipStatus.value); 


  // 檢查所有必填欄位
  const requiredFields = [
    email.value, password.value, username.value, gender.value, dateOfBirth.value,
    careerStatus.value, relationshipStatus.value
  ];

  if (requiredFields.some(field => !field)) {
    registerError.value = '請填寫所有必填欄位！';
    return;
  }

  try {
    const userData = {
      email: email.value.trim(),
      password: password.value,
      username: username.value,
      
      dateOfBirth: dateOfBirth.value, // YYYY-MM-DD 格式
      gender: mapGenderToBackend(gender.value),
      
      careerStatusValue: mapCareerStatusToBackend(careerStatus.value),
      relationshipStatusValue: mappedRelationshipStatus 

    };

    const response = await register(userData);
    console.log('Register successful:', response);
    registerSuccess.value = '註冊成功，請重新登入！';
    showSuccessModal.value = true;

    setTimeout(() => {
      showSuccessModal.value = false;
      router.push('/login');
    }, 1500);

  } catch (error) {
      console.error('Register failed:', error);
      
      let errorMessage = '網路連線失敗，請檢查後端服務器是否正在運行。';

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 400) {
          if (typeof responseData === 'string' && responseData.length > 0) {
            errorMessage = responseData; 
          } 
          else if (responseData && responseData.message) {
            errorMessage = responseData.message;
          }
          else {
            errorMessage = '註冊資料無效，請檢查輸入或更換電子郵件。';
          }
        } else if (status >= 500) {
          errorMessage = `伺服器內部錯誤 (${status})，請稍後再試。`;
        } else {
          errorMessage = `連線錯誤 (${status})：${error.response.statusText}`;
        }
        
        registerError.value = errorMessage;
          
      } else {
        registerError.value = errorMessage;
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
          <label for="username">暱稱</label>
          <input type="text" id="username" v-model="username" required>
        </div>

        <div class="form-group">
          <label for="dateOfBirth">生日</label>
          <input type="date" id="dateOfBirth" v-model="dateOfBirth" required>
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
            
            <input type="radio" id="careerUnemployed" value="職涯探索中" v-model="careerStatus" name="careerStatus" required>
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
            
            <input type="radio" id="relStable" value="穩定交往" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relStable">穩定交往</label>
            
            <input type="radio" id="relAmbiguous" value="曖昧" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relAmbiguous">曖昧</label>
            
            <input type="radio" id="relSingle" value="一個人也很好" v-model="relationshipStatus" name="relationshipStatus" required>
            <label for="relSingle">一個人也很好</label>
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

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success">
        <p>{{ registerSuccess }}</p>
      </div>
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

  /* Modal Styles */
  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }

  .modal-content {
      background-color: white;
      padding: 30px 40px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      text-align: center;
      color: var(--color-dark-text);
      font-size: 1.2em;
      max-width: 80%;
      min-width: 300px;
  }

  .modal-content.success {
      border: 2px solid #4CAF50;
  }
</style>