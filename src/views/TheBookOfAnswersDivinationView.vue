<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth';
  import { getBookAnswers } from '@/services/bookOfAnswers';

  const router = useRouter()
  const authStore = useAuthStore();
  const handleLogout = () => {
    authStore.logout();
  };

  const allAnswers = ref([]);

  // --- 漢堡選單 ---
  const isMenuOpen = ref(false); 

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  // --- 漢堡選單導航方法  ---
  const goHome = () => {
      isMenuOpen.value = false; // 關閉選單
      router.push('/');
  }
  const goBookOfAnswers = () => {
      isMenuOpen.value = false;
      resetToInstruction(); 
  }
  const goRunesOne = () => {
      isMenuOpen.value = false;
      router.push('/RunesOneDivination');
  }
  const goRunesTwo = () => {
      isMenuOpen.value = false;
      router.push('/RunesTwoDivination');
  }
  const goFortuneStickOne = () => {
      isMenuOpen.value = false;
      router.push('/FortuneStickOneDivination');
  }
  const goFortuneStickTwo = () => {
      isMenuOpen.value = false;
      router.push('/FortuneStickTwoDivination');
  }
  const goSanctuary = () => {
      isMenuOpen.value = false;
      router.push('/sanctuary');
  }


  // 狀態管理
  const hasStarted = ref(false); // 控制顯示說明還是結果
  const currentAnswer = ref(''); // 儲存當前的占卜結果
  const isLoading = ref(false); // 控制等待效果
  const isDataLoading = ref(true); // 新增：用於表示答案資料是否正在載入

  /**
   * 從 API 抓取解答之書的答案列表
   */
  const fetchAnswers = async () => {
    isDataLoading.value = true;
    try {
      // 假設 getBookAnswers 呼叫您的後端並返回圖片中結構的陣列
      const response = await getBookAnswers(); 
      allAnswers.value = response; // 儲存整個答案物件陣列
    } catch (error) {
      console.error("Error fetching book answers:", error);
      // 可以在這裡處理錯誤，例如顯示錯誤訊息給使用者
    } finally {
        isDataLoading.value = false;
    }
  };

  // 在元件掛載後執行抓取資料
  onMounted(() => {
    fetchAnswers();
  });


/**
 * * 隨機從答案列表中選取一個結果
 * */
  const getRandomAnswer = () => {
    if (allAnswers.value.length === 0) {
      return "抱歉，目前無法取得答案。"; // 處理資料為空的情況
    }
    // 從 allAnswers 中隨機選取一個答案物件
    const randomIndex = Math.floor(Math.random() * allAnswers.value.length);
    // 根據圖片中的資料庫欄位，取得 answer_content
    return allAnswers.value[randomIndex].answer_content; 
  };



  /**
   * 開始占卜的邏輯：切換畫面並產生結果
   */
  const startFortune = () => {
    hasStarted.value = true;
    generateResult();
  };

  /**
   * 產生結果並帶有短暫的等待動畫 (模擬翻書)
   */
  const generateResult = () => {
    isLoading.value = true; // 開始等待動畫
    currentAnswer.value = ''; // 清空舊結果

    // 設置一個短暫的延遲，模擬翻書的過程
    setTimeout(() => {
      currentAnswer.value = getRandomAnswer();
      isLoading.value = false;
    }, 1000); // 延遲1秒
  };

  /**
   * 再測一次的邏輯
   */
  const reRollFortune = () => {
    generateResult();
  };

  /**
   * 回到說明畫面
   */
  const resetToInstruction = () => {
      hasStarted.value = false;
      currentAnswer.value = '';
      isLoading.value = false;
  };
  
</script>


<template>
  <video autoplay muted loop id="book-background-video">
        <source src="/src/assets/videos/BackgroundV03.mp4" type="video/mp4">
  </video>

  <div class="book-page-container">
  <!-- 漢堡選單(shared.css) -->
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
        <li><button @click="goSanctuary">心靈樹洞</button></li>
      </ul>
    </nav>
    <div v-if="isMenuOpen" @click="toggleMenu" class="shared-menu-overlay"></div>

  <!-- Header(shared.css)-->
    <header class="shared-header">
        <div class="header-top">
            <div class="shared-logo">DIVINATION.NOW</div>
        </div>
        
        <div class="shared-header-divider"></div>
        
        <div class="shared-header-bottom">
            <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
            <div v-if="authStore.isAuthenticated">
              <nav class="auth-buttons">
              <router-link to="/member-profile" class="shared-btn-user">會員資料</router-link>
              <a @click="handleLogout" class="shared-btn-logout">登出</a>
              </nav>
            </div>
            <div v-else class="auth-content">
              <nav class="auth-buttons">
              <router-link to="/login" class="shared-btn-user">登入/註冊</router-link>
              </nav>

            </div>
        </div>
    </header>
  <!-- Main -->
    <main class="book-main-content">
      <h1 class="book-title-chinese">解答之書</h1>
      <h2 class="book-title-english">The Book Of Answers</h2>

      <div v-if="isDataLoading" class="book-card book-loading-data">
        <h3 class="book-card-title">正在準備解答之書...</h3>
        <p class="book-loading-text">請稍候，答案資料載入中。</p>
      </div>

      <section class="book-card">

        <div v-if="!hasStarted" class="book-instruction-panel">
          <h3 class="book-card-title">占卜方式說明</h3>
          <p class="book-instruction-text">
            閉上眼睛，深吸一口氣，讓心平靜下來
          </p>
          <p class="book-instruction-text book-instruction-emphasis">
            專注於你心中最想知道答案的問題
          </p>
          <p class="book-instruction-text">
            確認問題後，點擊下方的「開始占卜」按鈕，讓解答之書為你指引方向
          </p>
        </div>

        <div v-else class="book-result-panel">
          <h3 class="book-card-title">{{ isLoading ? '正在尋找答案...' : '解答之書的啟示' }}</h3>
          <div class="book-result-display">
            <p v-if="isLoading" class="book-loading-text">
              翻開神秘的書頁...
            </p>
            <p v-else class="book-fortune-result">
              "{{ currentAnswer }}"
            </p>
          </div>
        </div>
      </section>

      <div class="book-action-buttons">
        <button 
          v-if="!hasStarted" 
          @click="startFortune" 
          :disabled="isDataLoading"  class="shared-divination-btn book-btn-primary">
          {{ isDataLoading ? '載入中...' : '開始占卜' }}
        </button>

        <button 
          v-else 
          @click="reRollFortune" 
          :disabled="isLoading" 
          class="shared-divination-btn book-btn-primary">
          {{ isLoading ? '請稍候...' : '再測一次' }}
        </button>

        <button @click="resetToInstruction" class="book-btn-back">
          回到占卜方式說明
        </button>
      </div>
    </main>

    <!-- Footer(shared.css) -->
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
      position: fixed; /* 固定在視窗上，不隨滾動條移動 */
      top: 0;
      left: 0;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      z-index: -100; /* 放在所有內容之下 */
      overflow: hidden;
      object-fit: cover; 
  }

  .book-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: #EFEFF0; */
    color: #222;
    min-height: 100vh;
    width: 100%;
    position: relative; 
    z-index: 1;
    font-family: 'Microsoft JhengHei', 'Heiti TC', sans-serif;
  }


  .book-main-content {
    text-align: center;
    flex-grow: 1; 
    padding-top: 8px;
    width: 100%;
    max-width: 1000px;
  }

  .book-title-chinese {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: -10px;
    color: #222;
  }

  .book-title-english {
    font-size: 24px;
    font-weight: 300;
    color: #555;
    margin-bottom: 20px;
  }

  /* --- Card 占卜卡片 --- */
  .book-card {
    background-color: #fff;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .book-card-title {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 30px;
    padding-bottom: 10px;
    position: relative;
    color: #222;
  }

  .book-card-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background-color: #ddd;
  }

  /* 說明文字樣式 */
  .book-instruction-text {
    font-size: 18px;
    margin-bottom: 20px;
    color: #555;
    line-height: 1.8;
  }

  .book-instruction-emphasis {
    font-size: 20px;
    font-weight: 600;
    color: #222;
  }

  /* --- Result 區塊樣式 --- */
  .book-result-display {
    min-height: 100px; 
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }

  .book-loading-text {
    font-size: 18px;
    color: #8a70ff;
    animation: pulse 1.5s infinite;
    margin-top: 20px;
  }

  /* 用於顯示答案資料載入中的區塊，與 book-card 共用基礎樣式 */
  .book-loading-data {
    /* 沿用 book-card 的外觀，但可以增加一些載入中的視覺提示 */
    min-height: 200px; /* 確保內容顯示時有足夠空間 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
  }

  /* 確保載入中的標題清晰 */
  .book-loading-data .book-card-title {
    color: #555;
    margin-bottom: 10px;
  }

  /* 脈衝動畫 (Pulse Animation) */
  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  .book-fortune-result {
    font-size: 28px;
    font-weight: bold;
    color: #000; /* 原主按鈕顏色 */
    animation: fadeIn 1s;
  }

  /* --- Action Buttons 動作按鈕 --- */
  .book-action-buttons {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
  }



  /* 回到說明頁 */
  .book-btn-back {
    display: block;
    width: 280px;
    max-width: 90%;
    margin: 8px 0;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    text-decoration: none;
    text-align: center;
    background-color: #000; /* 黑色主按鈕 */
    color: #fff;
  }

  /* 開始占卜 / 再測一次 */
  .book-btn-primary {
    display: block;
    width: 280px;
    max-width: 90%;
    margin: 8px 0;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    text-decoration: none;
    text-align: center;
    background: linear-gradient(to right, #8993ee, #b69dfc);
    color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .btn-action:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .btn-action:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* --- 動畫 & RWD --- */

  @media (max-width: 770px) {
    .book-page-container {
      padding: 0;
    }

    .book-main-content {
      max-width: 100%;
      width: 100%;
      padding: 8px 20px; 
      box-sizing: border-box;
    }
    
    .book-card {
      max-width: 100%;
      width: 100%;
      padding: 30px 20px;
      box-sizing: border-box; 
    }
    
    /* 按鈕寬度統一調整 */
    .book-btn-back, 
    .book-btn-primary {
      width: 90% !important; 
      max-width: 320px !important; /* 設定一個合理的按鈕最大寬度 */
      padding: 12px 20px !important;
    }

}
</style>