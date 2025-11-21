<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import UserProfileCard from './UserProfileCard.vue';
import DivinationHistoryTable from './DivinationHistoryTable.vue';

const router = useRouter();
const isMenuOpen = ref(false); 

// 用於儲存後端獲取的真實資料
const userData = ref(null); 
const historyRecords = ref([]); 

// 2. 共用 API 輔助函數 (確保請求帶有 Token)
/**
 * 發送帶有 Token 的 fetch 請求的輔助函數
 * @param {string} url - API 終端點
 * @param {Object} options - fetch 請求的配置 (method, body 等)
 * @returns {Promise<Object>} API 回傳的 JSON 資料
 */
const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error('No Auth Token'); 
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 帶上 Token
        ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
        // 嘗試解析 JSON 獲取詳細錯誤信息
        const errorData = await response.json();
        throw new Error(errorData.message || `API 錯誤：${response.status}`);
    }

    return response.json(); 
};

// 登出與導航邏輯
const handleLogout = () => {
    localStorage.removeItem('userToken');  // 清除前端儲存的Token
    console.log('User logged out, navigating to login.');
    router.push('/login');
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

// 由於 resetToInstruction 未定義，先假設它是一個簡單的路由跳轉
const resetToInstruction = () => {
    router.push('/'); 
};

// 漢堡選單導航方法 
const goHome = () => { isMenuOpen.value = false; router.push('/'); }
const goBookOfAnswers = () => { isMenuOpen.value = false; resetToInstruction(); }
const goRunesOne = () => { isMenuOpen.value = false; router.push('/RunesOneDivination'); }
const goRunesTwo = () => { isMenuOpen.value = false; router.push('/RunesTwoDivination'); }
const goFortuneStickOne = () => { isMenuOpen.value = false; router.push('/FortuneStickOneDivination'); }
const goFortuneStickTwo = () => { isMenuOpen.value = false; router.push('/FortuneStickTwoDivination'); }


// 資料獲取與保護 (在 onMounted 中調用)
const fetchMemberData = async () => {
    try {
        // 使用 authFetch 請求用戶資料
        const userPromise = authFetch('/api/user/profile'); 
        // 使用 authFetch 請求歷史紀錄
        const recordsPromise = authFetch('/api/divination/history'); 

        const [userRes, recordsRes] = await Promise.all([userPromise, recordsPromise]);

        // 更新前端狀態
        userData.value = userRes;
        historyRecords.value = recordsRes.records || []; // 確保是陣列
        console.log('Member data loaded successfully.');

    } catch (error) {
        console.error('Error fetching member data:', error);
        
        if (error.message === 'No Auth Token' || error.message === 'Unauthorized') {
            alert('您的登入狀態已失效或無效，請重新登入。');
            handleLogout(); // Token 無效，強制登出
        } else {
            alert(`載入會員資料失敗: ${error.message}`);
            // 可選：載入失敗時，也強制登出
            // handleLogout();
        }
    }
};

// 處理子組件發出的更新事件 (PUT 請求)
const handleUpdateQuestion = async (updatedRecord) => {
    try {
        const apiUrl = `/api/divination/history/${updatedRecord.id}`;
        
        // 使用 authFetch 發送 PUT 請求更新問題
        await authFetch(apiUrl, {
            method: 'PUT',
            body: JSON.stringify({
                question: updatedRecord.question
            })
        });

        // 更新成功：同步更新前端的資料狀態
        const index = historyRecords.value.findIndex(r => r.id === updatedRecord.id);
        if (index !== -1) {
            historyRecords.value[index].question = updatedRecord.question;
            alert('占卜問題更新成功！');
        }

    } catch (error) {
        console.error('Failed to update question:', error);
        if (error.message === 'Unauthorized') {
            alert('權限不足或登入過期，請重新登入。');
            handleLogout();
        } else {
            alert(`更新占卜問題失敗: ${error.message}`);
        }
    }
};

// 生命週期
onMounted(() => {
    // 首次進入頁面檢查並載入資料
    const token = localStorage.getItem('userToken');
    if (token) {
        fetchMemberData();
    } else {
        // 若一開始就沒有 Token，直接導航至登入頁
        handleLogout(); 
    }
});
</script>

<template>
  <video autoplay muted loop id="book-background-video">
    <source src="/src/assets/videos/BackgroundV03.mp4" type="video/mp4">
  </video>

  <div class="book-page-container">
    <nav class="shared-hamburger-menu" :class="{ 'is-open': isMenuOpen }">
      <div class="shared-menu-header">
        <span class="shared-menu-title">占卜選單</span>
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
      </div>
      <ul class="shared-menu-links">
        <li><button @click="goHome">首頁</button></li>
        <li><button @click="goBookOfAnswers" class="is-current">解答之書</button></li>
        <li><button @click="goRunesOne">盧恩符文 (單顆)</button></li>
        <li><button @click="goRunesTwo">盧恩符文 (雙顆)</button></li>
        <li><button @click="goFortuneStickOne">六十甲子籤</button></li>
        <li><button @click="goFortuneStickTwo">雷雨師百籤</button></li>
      </ul>
    </nav>
    <div v-if="isMenuOpen" @click="toggleMenu" class="shared-menu-overlay"></div>

    <header class="shared-header">
      <div class="header-top">
        <div class="shared-logo">DIVINATION.NOW</div>
      </div>

      <div class="shared-header-divider"></div>
      <div class="shared-header-bottom">
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
        <div class="book-actions">
          <router-link to="/profile" class="shared-btn-user">會員資料</router-link>
          <a href="#" @click.prevent="handleLogout" class="shared-btn-logout">登出</a> 
        </div>
      </div>
    </header>

    <main>
      <div class="member-profile-page">
        <h2>我的會員檔案</h2>
        
        <UserProfileCard v-if="userData" :user="userData" />
        <p v-else>正在載入個人資料...</p>
        
        <div class="divider"></div>
        
        <h3>占卜紀錄</h3>
        <DivinationHistoryTable 
          :records="historyRecords" 
          @update-question="handleUpdateQuestion"
        />
      </div>
    </main>

    <footer class="shared-footer">
      <div class="shared-footer-content">
        <div class="shared-footer-links">
          <h3>快速連結</h3>
          <ul>
            <li><a href="#">關於我們</a></li>
            <li><a href="#">聯絡我們</a></li>
            <li><a href="#">常見問題</a></li>
            <li><a href="#">隱私政策</a></li>
          </ul>
        </div>

        <div class="shared-footer-social">
          <h3>追蹤我們</h3>
          <div class="shared-social-icons">
            <a href="#" class="shared-social-icon">F</a> 
            <a href="#" class="shared-social-icon">I</a>
            <a href="#" class="shared-social-icon">T</a>
          </div>
        </div>
      </div>
    
      <div class="shared-footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Divination. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  @import '/src/assets/styles/shared.css';
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* 防止出現水平滾動條 */
  }

  /* 背景影片樣式設定 */
  #book-background-video {
    position: fixed;
    top: 0;  
    left: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    overflow: hidden;
    object-fit: cover; 
  }

  .member-profile-page {
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px;
  }

  .divider {
    height: 1px;
    background-color: #eee;
    margin: 30px 0;
}

</style>