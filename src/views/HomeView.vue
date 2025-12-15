<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

import bannerImg from '@/assets/images/Banner02.jpg';
import BookOfAnswersImg from '@/assets/images/BookOfAnswersBanner.jpg';
import RunesImg from '@/assets/images/RunesImgBanner.jpg';
import FortuneStickImg from '@/assets/images/FortuneStickBanner.jpg';

const router = useRouter()

const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
};

function goBookOfAnswers() {
  router.push('/TheBookOfAnswersDivination')
}
function goRunesOne() {
  router.push('/RunesOneDivination')
}
function goRunesTwo() {
  router.push('/RunesTwoDivination')
}
function goFortuneStickOne() {
  router.push('/FortuneStickOneDivination')
}
function goFortuneStickTwo() {
  router.push('/FortuneStickTwoDivination')
}
function goSanctuary() {
  router.push('/sanctuary')
}


</script>

<template>
  <div id="app-container">
    <!-- Header版位 -->
    <header class="banner">
      <h1 class="main-title">DIVINATION.NOW</h1>

      <div v-if="authStore.isAuthenticated" class="auth-content">
        <nav class="auth-login-content">
          <router-link to="/member-profile" class="shared-btn-user">會員資料</router-link>
          <a @click="handleLogout" class="shared-btn-logout">登出</a>
        </nav>
      </div>
      <div v-else class="auth-content">
        <nav class="auth-buttons">
          <router-link to="/login" class="login-btn">登入/註冊</router-link>
        </nav>
        <p class="login-tip">※ 登入會員自動記錄占卜結果</p>
      </div>
      
      <div class="banner-image-container">
        <div class="image-placeholder-top">
          <img :src="bannerImg" alt="BannerImage" class="actual-banner-image">
        </div>
      </div>
    </header>

    <!-- 解答之書版位 -->
    <main class="main-content">
      <div class="text-content">
        <div class="title-section">
          <h1>解答之書<br>快速占卜</h1>
        </div>
        <p class="subtitle">
          "命運的頁面，只為你掀開。"<br><br>
          靜下心，閉上眼，默想你想要問的問題。<br>
          當你準備好時，翻開書頁——答案將現身。<br><br>
          ** 本占卜結果不會記錄於會員資料 **
        </p>
        <button @click="goBookOfAnswers" class="shared-divination-btn">啟示現在</button>
      </div>
      <img :src="BookOfAnswersImg" alt="BookOfAnswersImg" class="image-placeholder-bottom">
    </main>
    
    <!-- 盧恩符文版位 -->
    <main class="main-content reverse-content">
      <img :src="RunesImg" alt="RunesImg" class="image-placeholder-bottom">
      <div class="text-content">
        <div class="title-section">
          <h1>盧恩符文<br>北歐古老智慧之石</h1>
        </div>
        <p class="subtitle">
          "奧丁的贈禮，跨越時空的指引。"<br>
          輕輕抽取，讓蘊含古老啟示的符文，為你解讀迷惘，開啟內在覺醒的力量。<br><br>
          單顆占卜： 聚焦當下，快速獲得單一事件的關鍵提示。<br>
          雙顆占卜： 雙重洞察，揭示核心問題，給予未來指引與建議。

        </p>
        <button @click="goRunesOne" class="shared-divination-btn">單顆符文</button>
        <button @click="goRunesTwo" class="shared-divination-btn">雙顆符文</button>
      </div>
    </main>

    <!-- 台灣民間信仰抽籤版位 -->
    <main class="main-content">
      <div class="text-content">
        <div class="title-section">
          <h1>台灣民間信仰求籤<br>連結人心與天意</h1>
        </div>
        <p class="subtitle">
          "讓神明為你撥開迷霧，明確指引。"<br><br>
          六十甲子籤循著古老干支的輪迴，以詩句映照人生的吉凶與流轉，讓人從典故中尋得命運的方向。<br>
          雷雨師百籤則由掌雷與雨的神祇傳遞天道之聲，以嚴正的詩文警醒眾生，提醒世人敬天畏道、順應因果。<br>
        </p>
        <button @click="goFortuneStickOne" class="shared-divination-btn">六十甲子籤</button>
        <button @click="goFortuneStickTwo" class="shared-divination-btn">雷雨師​百籤</button>
      </div>
      <img :src="FortuneStickImg" alt="FortuneStickBannerImg" class="image-placeholder-bottom">
    </main>

    <!-- 留言板版位 -->
    <section class="sanctuary-section reverse-content"> <div class="message-board-header">
      <div class="title-section">
          <h1 class="sanctuary-h1">心靈樹洞<br></h1> </div>
        <p class="sanctuary-subtitle">
            將你的迷惘、體悟，或是占卜帶給你的細微波動託付於此。<br>
            讓思緒輕輕落地，無需隱藏，我們傾聽陪伴著你。<br>
        </p>
        <div class="button-center">
            <button @click="goSanctuary" class="sanctuary-btn">
                進入留言板
            </button>
        </div>
      </div>
    </section>


    <!-- Footer版位 -->
    <div id="app-container">
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-links">
            <h3>快速連結</h3>
            <ul>
              <li><a href="#">關於我們</a></li>
              <li><a href="#">聯絡我們</a></li>
              <li><a href="#">參考資料來源</a></li> 
              <li><a href="#">隱私權政策</a></li> 
            </ul>
          </div>

        <div class="footer-social">
          <h3>追蹤我們</h3>
            <div class="social-icons">
            <a href="#" class="social-icon">F</a> 
            <a href="#" class="social-icon">I</a>
            <a href="#" class="social-icon">T</a>
          </div>
        </div>
      </div>

        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} Divination. All rights reserved.</p>
        </div>
      </footer>
    </div>
    
  </div>
</template>


<style scoped>
@import '/src/assets/styles/shared.css';

/* -------------------- 容器與基礎設定 -------------------- */
#app-container {
display: flex; 
  flex-direction: column; 
  background-color: white; 
  color: #1a1a2e;
  font-family: 'Microsoft JhengHei', 'Heiti TC', sans-serif;
  width: 100%;
}

/* -------------------- 1. 頂部 Banner 區塊 -------------------- */
.banner {
  background-color: white;
  /* padding-bottom: 30px; */
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; 
  align-items: flex-start; /* 讓標題和按鈕區塊從頂部對齊 */

}

/* 頂部大標題 */
.main-title {
  font-size: 5rem;
  font-weight: 900;
  /* text-align: left; */
  margin: 0;
  /* padding: 30px 80px 0; */
  padding: 30px 0 0 80px;
  letter-spacing: 0.1em;
  color: black;
  flex-shrink: 0;
}

/* Banner 圖片容器 */
.banner-image-container {
  width: 100%;
  order: 1;
  margin-top: 20px;
  padding: 0 80px;
  box-sizing: border-box;
}

/* Banner 圖片 */
.image-placeholder-top {
  width: 100%;
  height: 600px;
  border-radius: 15px;
  position: relative;
  overflow: hidden; 
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Banner圖片設定 */
.actual-banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 包裹按鈕和提示文字的容器 */
.auth-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end; 
  padding: 60px 80px 0 0; 
  flex-shrink: 0;
}

.auth-login-content{
  padding: 20px 10px 0 0; 
}


/* 登入/註冊按鈕定位 */
.auth-section-wrapper {
  position: absolute;
  top: 60px;
  right: 80px;
  z-index: 20;
  width: auto; 
  padding: 0;
  margin: 0;
  display: block;
}
.auth-buttons {
  z-index: 10;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.auth-buttons:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(240, 230, 255, 0.8);
}
.auth-buttons .login-btn {
  display: inline-block;
  text-decoration: none;
  padding: 10px 40px;
  border: none;
  border-radius: 50px;
  background-color: rgb(0, 0, 0);
  color: white; 
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}
/* 提示文字樣式 */
.login-tip {
  font-size: 0.8rem; 
  color: #555; 
  margin-top: 8px;
  text-align: center; 
}

/* -------------------- 主要內容區塊 -------------------- */
.main-content {
  margin: 80px 80px 0; 
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0;
  margin-bottom: 50px;
}

/* 左側文字內容 */
.text-content {
  flex: 1; 
  max-width: 600px; 
  padding-right: 50px;
}

.title-section h1 {
  font-size: 3rem; 
  font-weight: 900;
  color: black;
  line-height: 1.2;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* 進入占卜頁面 按鈕 (放到shared.css)


/* 右側裝飾圖片區塊 */
.image-placeholder-bottom {
  width: 600px;
  height: 450px;
  background-color: #e0e0e0; 

  background-image: linear-gradient(to top right, #9fa8da, #d1c4e9);
  background-size: cover;
  border-radius: 15px;
  flex-shrink: 0;
}

/* 文字靠右的文字間距*/
.reverse-content .text-content {
  padding-right: 0;
  padding-left: 50px;  
}

/* 圖片靠左的圖片調整*/
.reverse-content .image-placeholder-bottom {
  margin-right: 0;
}


/* -------------------- 占卜紀錄分享展示區塊 -------------------- */
.sanctuary-section {
    margin: 80px 80px; 
    padding: 60px 30px; 
    background: linear-gradient(135deg, #c0c0eb 0%, #293241 100%); /* ⭐ 深色漸變背景 */
    border-radius: 20px; /* 圓角更大 */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); /* ⭐ 更深的陰影 */
    display: flex;
    flex-direction: column;
    align-items: center; /* 內容置中 */
    text-align: center;
    position: relative;
    overflow: hidden;
}

.message-board-header {
    margin-bottom: 30px;
    text-align: center;
    z-index: 2; /* 確保文字在最上層 */
}

.message-board-header .title-section {
    /* 確保標題區塊正確顯示 */
    display: inline-block;
}

.sanctuary-h1 { /* ⭐ 新標題樣式 */
    font-size: 3.5rem;
    font-weight: 900;
    color: #e0f7fa; /* 淺藍色文字 */
    line-height: 1.2;
    margin-bottom: 15px;
    letter-spacing: 0.1em;
    text-shadow: 0 0 10px rgba(163, 204, 255, 0.7); /* 柔和發光效果 */
}

.sanctuary-subtitle{
    font-size: 1.2rem;
    color: #dce4ef; /* 柔和藍灰色 */
    margin-bottom: 40px;
    line-height: 1.8;
    max-width: 900px;
}

.sanctuary-btn {
    background-color: #ffcc80; /* 溫暖的橙色調 */
    color: #1a1a2e;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 15px 40px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(255, 204, 128, 0.5);
    transition: background-color 0.3s, transform 0.2s;
    text-decoration: none;
    display: inline-block;
}

.sanctuary-btn:hover {
    background-color: #ffb74d;
    transform: translateY(-2px);
}

/* -------------------- Footer -------------------- */
.app-footer {
  margin-top: auto; 
  width: 100%;
  background: linear-gradient(to bottom, #e3f5ff, #f9eadf); 
  color: #333;
  padding-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 50px 40px; 
  border-bottom: none;
}

.footer-links h3, .footer-social h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: black; 
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: #007bff;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #89e4ff;
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
}

.social-icon:hover {
  background-color: #4ed2f5;
}

.footer-bottom {
  text-align: center;
  padding: 20px 50px;
  font-size: 0.85rem;
  color: #555;
}


/* ============================== RWD ============================== */

@media (max-width: 1200px) {
/* 調整整體邊距 */
  .main-title {
    font-size: 4rem;
    padding: 20px 40px 0;
  }
  .banner-image-container,
  .auth-section-wrapper {
    padding: 0 40px;
  }

  /* 包裹按鈕和提示文字的容器 */
  .auth-content {
    display: flex;
    flex-direction: column;
    align-items: flex-end; 
    padding: 30px 80px 0 0; 
    flex-shrink: 0;
  }

  .auth-login-content{
  padding: 20px 10px 0 0; 
}
  /* 針對登入/註冊按鈕區塊的修正 */
    .auth-section-wrapper {
        top: 0px;
        right: 40px;
        margin-bottom: 30px;
    }

  /* 調整內容區塊的圖片和文字寬度 */
  .main-content {
    margin: 60px 40px;
  }

  /* 調整文字大小 */
  .title-section h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.05rem;
    margin-bottom: 30px;
  }

  /* 調整圖片和文字容器間距 */
  .text-content {
    padding-right: 30px;
    flex: 1;
    max-width: 55%; 
  }

  .reverse-content .text-content {
    padding-left: 30px; 
  }

  /* 調整圖片大小 */
  .image-placeholder-bottom {
    width: 400px; 
    height: 300px;
  }

  .sanctuary-section {
    margin: 60px 40px; padding: 60px 40px  
  }
  .sanctuary-h1  {
    font-size: 3rem 
  }

  /* 調整 Footer 置中寬度 */
  .footer-content {
    max-width: 960px;
    padding: 0 40px 40px;
  }
  .message-board-section {
    margin: 60px 40px; 
    padding: 40px;
  }
  .posts-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 1046px) {
  .main-title {
    font-size: 3rem; 
    padding: 20px 0 0 40px; 
  }
  
  .auth-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  padding: 20px 40px 0 0; 
  margin-left: 40px;
  flex-shrink: 0;
}

  .auth-section-wrapper {
    top: 20px; 
    right: -25px; 
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
    padding: 20px 20px 0;
    margin-right: 20px;
  }
  
  .banner-image-container {
    padding: 0 20px;
    margin-bottom: 30px;
  }
  
  .auth-login-content{
  padding: 10px 10px 0 0; 
  margin-left: 20px;
  }

  .auth-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    padding: 10px 80px 0 0; 
    margin-left: 20px;
    flex-shrink: 0;
  }

  .auth-buttons {
    top: 30px; 
    /* padding: 20px 20px 0; */
  }

  .auth-section-wrapper {
    top: 320px;
    right: 20px;
    padding: 0;
  }

  /* 內容區塊垂直堆疊 */
  .main-content {
    flex-direction: column; 
    margin: 30px 20px;
    align-items: center;
  }

  /* 調整圖片和文字區塊的寬度 */
  .text-content {
    width: 100%;
    max-width: 100%;
    padding-right: 0;
    order: 2;
  }
  
  .title-section h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem; 
  }

  .image-placeholder-top {
    height: 250px; 
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .actual-banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover; 
  }
  
  .image-placeholder-bottom {
    width: 100%;
    height: 300px;
    object-fit: cover;
    margin-bottom: 30px;
  }

  /* 交錯內容區塊的順序 */
  .main-content.reverse-content {
    flex-direction: column; 
  }

  .reverse-content .text-content {
    padding-left: 0;
    padding-right: 0; 
  }
  
  .reverse-content .image-placeholder-bottom {
    margin-right: 0; 
  }

  .sanctuary-section { /* ⭐ RWD 樣式 */
      margin: 30px 20px; 
      padding: 40px 20px;
  }
  .sanctuary-h1 {
      font-size: 2.5rem;
  }
  .sanctuary-subtitle {
      font-size: 1rem;
  }

  /* Footer 調整 (垂直排列) */
  .footer-content {
    flex-direction: column;
    padding: 0 20px 30px;
    gap: 30px;
  }

  .footer-links, .footer-social {
    text-align: center;
  }

  .footer-links ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .social-icons {
    justify-content: center;
  }
  
  .footer-bottom {
    padding: 15px 20px;
  }

  .message-board-section {
    margin: 30px 20px; 
    padding: 20px;
  }
  
  .message-board-header .title-section h1 {
    font-size: 2rem;
  }
  
  .posts-list {
    grid-template-columns: 1fr; /* 768px 以下改為單欄 */
    gap: 15px;
  }
}

</style>