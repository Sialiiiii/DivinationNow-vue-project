<script setup>
import { ref, onMounted, computed } from 'vue'; // ⭐ 新增 computed
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// ⭐ 關鍵：確保引入所有的 API 服務，並避免與本地函數名衝突
import { fetchMemberData as apiFetchMemberData, fetchAllStatuses, updateProfile } from '@/services/user.js';

import UserProfileCard from '@/components/Member/UserProfileCard.vue';
import DivinationHistoryTable from '@/components/Member/DivinationHistoryTable.vue';

const router = useRouter();
const isMenuOpen = ref(false); 
const authStore = useAuthStore();

// 用於儲存後端獲取的真實資料
const userData = ref(null); 
const historyRecords = ref([]); 
// ⭐ 新增狀態數據儲存
const allStatuses = ref([]); 

// ⭐ 計算屬性：過濾出事業狀態 (供 UserProfileCard 使用)
const careerStatuses = computed(() => {
    // 過濾出 type 為 'Career' 的狀態
    return allStatuses.value.filter(s => s.type === 'Career');
});

// ⭐ 計算屬性：過濾出感情狀態 (供 UserProfileCard 使用)
const relationshipStatuses = computed(() => {
    // 過濾出 type 為 'Relationship' 的狀態
    return allStatuses.value.filter(s => s.type === 'Relationship');
});

// 創建專用的 axios 實例（避免污染全域）
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true
});


// 響應攔截器：統一處理 401 錯誤
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert('您的登入狀態已失效或無效，請重新登入。');
      handleLogout();
    }
    return Promise.reject(error);
  }
);

// 登出與導航邏輯
const handleLogout = () => {
  // 🚀 關鍵修正 3: 不再手動操作 localStorage，只呼叫 Pinia Store 的 logout
  authStore.logout(); 
  console.log('User logged out, navigating to login.');
  // 注意：authStore.logout() 內會執行 router.push('/')
  router.push('/login'); // 由於您的 Store 內導向的是 /，這裡改為導向 /login
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const resetToInstruction = () => {
  router.push('/'); 
};

// 漢堡選單導航方法 
const goHome = () => { 
  isMenuOpen.value = false; 
  router.push('/'); 
};
const goBookOfAnswers = () => { 
  isMenuOpen.value = false; 
  router.push('/TheBookOfAnswersDivination')
};
const goRunesOne = () => { 
  isMenuOpen.value = false; 
  router.push('/RunesOneDivination'); 
};
const goRunesTwo = () => { 
  isMenuOpen.value = false; 
  router.push('/RunesTwoDivination'); 
};
const goFortuneStickOne = () => { 
  isMenuOpen.value = false; 
  router.push('/FortuneStickOneDivination'); 
};
const goFortuneStickTwo = () => { 
  isMenuOpen.value = false; 
  router.push('/FortuneStickTwoDivination'); 
};

// 資料獲取：現已包含會員資料和狀態選項
const loadMemberData = async () => { // ⭐ 重新命名為 loadMemberData 避免與 import 衝突
  try {
    // 1. 獲取用戶資料和歷史紀錄
    const [userResponse, recordsResponse] = await Promise.all([
      apiFetchMemberData(), // ⭐ 使用從 API 導入的 fetchMemberData
      apiClient.get('/divination/history')
    ]);

    // 2. 獲取所有狀態選項
    const statusResponse = await fetchAllStatuses(); // ⭐ 新增：獲取狀態選項

    // 更新前端狀態
    userData.value = userResponse; // API 函數通常會返回 data，這裡假設它返回 data
    allStatuses.value = statusResponse; // ⭐ 更新狀態選項
    historyRecords.value = recordsResponse.data.records || [];
    console.log('Member data loaded successfully.');

  } catch (error) {
    // ... (錯誤處理保持不變)
    if (error.response?.status !== 401) {
      console.error('Error fetching member data:', error);
      alert(`載入會員資料失敗: ${error.message || '網路錯誤'}`);
    }
  }
};

// ⭐ 新增：處理 UserProfileCard 發來的更新請求
const handleProfileUpdate = async (payload) => {
    try {
        // 調用 API 服務發送 PATCH 請求
        const updatedUser = await updateProfile(payload);
        
        // 更新成功：用新的數據覆蓋現有數據，觸發子組件的 watch 進行更新
        userData.value = updatedUser;
        alert('會員資料更新成功！');

    } catch (error) {
        console.error('Failed to update user profile:', error);
        alert('更新會員資料失敗，請檢查輸入。');
        // 實際應用中，您可能需要重新載入或回滾數據
        // loadMemberData(); 
    }
};

// 處理子組件發出的更新事件
const handleUpdateQuestion = async (updatedRecord) => {
  try {
    // 使用專用的 axios 實例
    await apiClient.put(`/divination/history/${updatedRecord.id}`, {
      question: updatedRecord.question
    });

    // 更新成功：同步更新前端的資料狀態
    const index = historyRecords.value.findIndex(r => r.id === updatedRecord.id);
    if (index !== -1) {
      historyRecords.value[index].question = updatedRecord.question;
      alert('占卜問題更新成功！');
    }

  } catch (error) {
    console.error('Failed to update question:', error);
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '更新占卜問題失敗';
      
      if (status === 401) {
        // 401 錯誤已由攔截器處理
        return;
      } else {
        alert(`${message} (錯誤代碼: ${status})`);
      }
    } else if (error.request) {
      alert('網路連線錯誤，請檢查您的網路連線。');
    } else {
      alert(`更新占卜問題失敗: ${error.message}`);
    }
  }
};

// 生命週期
onMounted(() => {
  loadMemberData(); // ⭐ 呼叫新的載入函數
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
        <li><button @click="goBookOfAnswers">解答之書</button></li>
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
          <router-link to="/member-profile" class="shared-btn-user">會員資料</router-link>
          <a href="#" @click.prevent="handleLogout" class="shared-btn-logout">登出</a> 
        </div>
      </div>
    </header>

    <main>
      <div class="member-profile-page">
        <h2>我的會員檔案</h2>
        
        <UserProfileCard 
            v-if="userData" 
            :user="userData" 
            
            :careerStatuses="careerStatuses"        
            :relationshipStatuses="relationshipStatuses" 
            
            @update-profile="handleProfileUpdate"
        />
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