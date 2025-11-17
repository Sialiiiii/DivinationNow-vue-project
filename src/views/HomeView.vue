<script setup>
import { useRouter } from 'vue-router'

import bannerImg from '@/assets/images/Banner02.jpg';
import BookOfAnswersImg from '@/assets/images/BookOfAnswersBanner.jpg';
import RunesImg from '@/assets/images/RunesImgBanner.jpg';
import FortuneStickImg from '@/assets/images/FortuneStickBanner.jpg';

const router = useRouter()

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

</script>

<template>
  <div id="app-container">
    <!-- Header版位 -->
    <header class="banner">
      <h1 class="main-title">DIVINATION.NOW</h1>
      
      <div class="banner-image-container">
        <div class="image-placeholder-top">
          <img :src="bannerImg" alt="BannerImage" class="actual-banner-image">
        </div>
      </div>
    </header>

  <div class="auth-section-wrapper">
    <div class="auth-content">
      <nav class="auth-buttons">
        <router-link to="/login" class="login-btn">登入/註冊</router-link>
      </nav>
      <p class="login-tip">※ 登入會員可自動記錄每次占卜結果</p>
    </div>
  </div>

    <!-- 解答之書版位 -->
    <main class="main-content">
      <div class="text-content">
        <div class="title-section">
          <h1>解答之書<br>快速占卜</h1>
        </div>
        <p class="subtitle">
          "命運的頁面，只為你掀開。"<br><br>
          靜下心，閉上眼，默想你想要問的問題。<br>
          當你準備好時，翻開書頁——答案將現身。
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
display: flex; /* 啟用 Flexbox */
  flex-direction: column; /* 垂直排列子元素 */
  background-color: white; /* 畫面背景是白色 */
  color: #1a1a2e;
  /* min-height: 100vh; */
  font-family: 'Microsoft JhengHei', 'Heiti TC', sans-serif;
  width: 100%;
}

/* -------------------- 1. 頂部 Banner 區塊 -------------------- */
.banner {
  background-color: white;
  padding-bottom: 30px;
  /* position: relative;  */
  width: 100%;
}

/* 頂部大標題 */
.main-title {
  font-size: 5rem;
  font-weight: 900;
  text-align: left;
  margin: 0;
  padding: 30px 80px 0;
  letter-spacing: 0.1em;
  color: black;
}

/* Banner 圖片容器 */
.banner-image-container {
  width: 100%;
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
  flex-direction: column; /* **垂直排列** 子元素 (按鈕在上面，文字在下面) */
  align-items: center; /* 讓按鈕和文字在水平方向上置中對齊 */
}

/* 登入/註冊按鈕定位 */
.auth-section-wrapper {
  width: 100%;
  padding: 10px 80px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end; 
  margin-top: -30px; 
  margin-bottom: 30px; 
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
  margin-top: 3px;
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
  padding-right: 0;  /* 移除第一組的padding-right: 50px; */
  padding-left: 50px;  
}

/* 圖片靠左的圖片調整*/
.reverse-content .image-placeholder-bottom {
  margin-right: 0;
}

/* -------------------- Footer -------------------- */
.app-footer {
  margin-top: auto; 
  width: 100%;
  background: linear-gradient(to bottom, #e3f5ff, #f9eadf); 
  color: #333; /* 文字改為深色 */
  padding-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 50px 40px; 
  border-bottom: none; /* 移除白色分隔線 */
}

.footer-links h3, .footer-social h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: black; /* 標題改為黑色 */
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
  color: #333; /* 連結文字改為深色 */
  text-decoration: none;
  transition: color 0.3s;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: #007bff; /* Hover 顏色可選一個活潑的藍色 */
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
  background-color: #89e4ff; /* 亮藍綠色 */
  color: white; /* 圖標文字改為白色 */
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
}

.social-icon:hover {
  background-color: #4ed2f5; /* Hover 時顏色變深 */
}

.footer-bottom {
  text-align: center;
  padding: 20px 50px;
  font-size: 0.85rem;
  color: #555;
}


/* ============================== RWD ============================== */

@media (max-width: 1200px) {
/* 1. 調整整體邊距 */
  .main-title {
     font-size: 4rem;
      padding: 20px 40px 0; /* 縮小左右邊距 */
  }

  .banner-image-container,
  .auth-section-wrapper {
    padding: 0 40px; /* 統一邊距 */
  }

  /* 針對登入/註冊按鈕區塊的修正 */
    .auth-section-wrapper {
        margin-top: -15px; /* 從 -30px 調整為 -15px 或直接設為 0 */
        margin-bottom: 30px; 
    }

  /* 調整內容區塊的圖片和文字寬度 */
  .main-content {
    margin: 60px 40px; /* 統一邊距，上下間距稍大 */
  }

  /* 2. 核心修正：調整文字大小 */
  .title-section h1 {
    font-size: 2.5rem; /* 標題字體在中螢幕上適度縮小 */
  }

  .subtitle {
    font-size: 1.05rem; /* 內文字體適度縮小 */
    margin-bottom: 30px; /* 縮小與按鈕的間距 */
  }

  /* 3. 調整圖片和文字容器間距 */
  .text-content {
    padding-right: 30px; /* 縮小與圖片的間距 */
    /* 允許文字內容佔用更多空間，但仍保持 max-width */
    flex: 1; /* 確保在 flex 容器中能彈性伸展 */
    max-width: 55%; /* 讓文字內容在中螢幕下佔據約一半多一點的空間 */
  }

  .reverse-content .text-content {
    padding-left: 30px; /* 縮小與圖片的間距 */
  }

  /* 4. 調整圖片大小 */
  .image-placeholder-bottom {
    width: 400px; /* 圖片進一步縮小 */
    height: 300px;
  }

  /* 5. 調整 Footer 置中寬度 */
  .footer-content {
    max-width: 960px; /* 調整最大寬度 */
    padding: 0 40px 40px; /* 統一邊距 */
  }
}

@media (max-width: 768px) {
  /* 整體邊距和標題 */
  .main-title {
    font-size: 2.5rem; /* 手機上標題變小 */
    padding: 20px 20px 0; /* 縮小左右邊距 */
  }
  
  /* 圖片容器和按鈕的邊距也縮小 */
  .banner-image-container {
    padding: 0 20px;
  }
  
  .auth-buttons {
    top: 30px; 
    padding: 20px 20px 0;
  }

  .login-tip {
    font-size: 0.75rem; /* 在手機上可能需要更小 */
  }

  .auth-section-wrapper {
    padding: 10px 20px; /* 縮小左右邊距 */
    /* 保持 display: flex; justify-content: flex-end; */
  }

  /* 2. 內容區塊垂直堆疊 */
  .main-content {
    flex-direction: column; /* 讓內容由橫向改為縱向堆疊 */
    margin: 30px 20px; /* 移除左右邊距，讓內容貼邊 */
    align-items: center; /* 讓內容置中 */
  }

  /* 3. 調整圖片和文字區塊的寬度 */
  .text-content {
    width: 100%;
    max-width: 100%; /* 移除文字寬度限制 */
    padding-right: 0; /* 移除右側 padding */
    order: 2; /* 讓文字在手機上放在圖片下方 */
  }
  
  .title-section h1 {
    font-size: 2rem; /* 手機上標題變小 */
  }

  .subtitle {
    font-size: 1rem; /* 內文變小 */
  }

  .image-placeholder-top {
    height: 250px; 
    display: flex; /* 確保內部圖片可以置中 */
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

  /* 4. 修正交錯內容區塊的順序 */
  .main-content.reverse-content {
    /* 在手機上，讓所有內容都恢復到 圖片(1) -> 文字(2) 的順序 */
    flex-direction: column; 
  }

  .reverse-content .text-content {
    padding-left: 0;
    padding-right: 0; 
  }
  
  .reverse-content .image-placeholder-bottom {
    margin-right: 0; 
  }

  /* 5. Footer 調整 (垂直排列) */
  .footer-content {
    flex-direction: column; /* 將連結和社群媒體垂直堆疊 */
    padding: 0 20px 30px; /* 縮小內邊距 */
    gap: 30px; /* 增加上下間距 */
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
}
</style>