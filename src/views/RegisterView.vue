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
            <label for="careerUnemployed">待業</label>
            
            <input type="radio" id="careerStudent" value="學生" v-model="careerStatus" name="careerStatus" required>
            <label for="careerStudent">學生</label>
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

<script setup>
// ... (JavaScript 保持不變)
import { ref } from 'vue';
import '@/assets/styles/auth.css'; // 您的樣式文件

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const fullName = ref('');
const gender = ref(''); 
const birthday = ref(''); 
const careerStatus = ref(''); 
const relationshipStatus = ref(''); 

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('密碼不一致');
    return;
  }
  
  if (!email.value || !password.value || !confirmPassword.value || !fullName.value || !gender.value || !birthday.value || !careerStatus.value || !relationshipStatus.value) {
      alert('請填寫所有必填欄位！');
      return;
  }

  console.log('Register attempt with:', {
    email: email.value,
    fullName: fullName.value,
    gender: gender.value,
    birthday: birthday.value,
    careerStatus: careerStatus.value,
    relationshipStatus: relationshipStatus.value,
  });

  alert(`註冊成功，Email: ${email.value}`);
};
</script>

