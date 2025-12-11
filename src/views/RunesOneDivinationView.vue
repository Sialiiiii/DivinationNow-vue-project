<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchRuneData, saveRuneLog } from '../services/runes';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
 const handleLogout = () => {
    authStore.logout();
  };

if (!router) {
  console.error('Router is not available!')
}

// --- 狀態管理 ---
const showInstruction = ref(true); 
const isMenuOpen = ref(false); 
const isReadingLoading = ref(false); 
const drawnCardId = ref(null);
const isHovering = ref(false);


// --- 資料狀態管理 ---
const isDataLoading = ref(true); // 追蹤初始 API 抓取狀態
const allRuneData = ref([]); // 存放從 API 抓取的完整符文資料

const initialCardDeck = ref([]); 
const shuffledCards = ref([]);


// --- 漢堡選單 ---
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const goHome = () => {
    isMenuOpen.value = false;
    router.push('/');
}
const goBookOfAnswers = () => {
    isMenuOpen.value = false;
    router.push('/TheBookOfAnswersDivination'); 
}
const goRunesOne = () => {
    isMenuOpen.value = false;
    resetToInstruction();
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

// --- 邏輯函數 ---

/**
 * [NEW] 從 API 抓取完整的符文資料
 */
async function fetchAllRuneData() {
    isDataLoading.value = true;
    try {
        const apiData = await fetchRuneData(); 

        // 將 API 資料欄位轉換為前端慣用的結構
        const formattedData = apiData.map(item => ({
            original_orientation_id: item.orientation_id, 
            rune_id: item.rune_id,
            isReversed: item.is_reversed === 1, // 將 tinyint(1) 轉為 boolean
            full_name_zh: item.full_name_zh,
            full_name_en: item.full_name_en, 
            general_meaning: item.rune_general_meaning,
            image: item.rune_image_url, 
        }));
        allRuneData.value = formattedData;

    } catch (error) {
        console.error('Initial rune data fetch failed:', error);
        alert('無法載入盧恩符文資料，請檢查網路連線或後端服務。');
    } finally {
        isDataLoading.value = false;
    }
}

/**
 * 從完整的牌組中隨機選取 24 張卡片
 */
function select24RandomCards(fullDeck) {
    const deck = [];
    while (deck.length < 24) {
        deck.push(...fullDeck);
    }
    // Fisher-Yates 洗牌
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // 選取前 24 張並給予唯一的ID
    return deck.slice(0, 24).map((card, index) => ({
        ...card,
        id: card.original_orientation_id * 100 + index
    })); 
}


/**
 * 進入抽卡畫面
 */
function startDivination() {
    if (isDataLoading.value || allRuneData.value.length === 0) {
        console.warn("Rune data not loaded yet. Cannot start divination.");
        return;
    }
    showInstruction.value = false;
    // 每次開始前重新選取24張並洗牌
    initialCardDeck.value = select24RandomCards(allRuneData.value); // *** 使用 API 資料 ***
    shuffleAndReset();
}
  
/**
 * 【API 串接點 】模擬將占卜結果記錄到會員資料
 */
async function saveDivinationRecord(card, finalReadingText) {
  if (!authStore.isAuthenticated) {
    console.log('[未登入] 占卜結果未記錄。');
    return;
  }
  try {
    // 必須使用 user.user_id 來獲取 Long 類型的 ID
    const userId = authStore.user?.user_id; 
    // 這是 rune_orientation_id
    const orientationId = card.original_orientation_id; 
    
    // 🚀 關鍵修正點：單顆占卜不涉及主題/狀態 ID，傳遞 0 或 null
    const statusId = 0; 
    
      if (!userId || !orientationId) {
          console.error('[記錄失敗] 缺少 user_id 或符文 ID。');
          return;
      }

    console.log(`[記錄點] 會員 ${userId} 正在記錄單顆符文占卜結果...`);

      // *** 呼叫 API 紀錄 ***
    // 🚀 修正點：傳遞 statusId 參數
    const result = await saveRuneLog(userId, orientationId, statusId); 
    console.log(`[記錄成功] 占卜紀錄已完成。Log ID: ${result.log_id || 'N/A'}`);
  } catch (error) {
    console.error(`[記錄失敗] 發生錯誤:`, error);
  }
}


/**
 * 處理卡片點擊事件 (抽牌/翻面邏輯)
 */
async function handleCardClick(clickedCard) {
    // 如果卡片已翻面，則鎖定點擊。
    if (clickedCard.isFlipped) {
        return;
    }
    
    // 如果有卡片正在加載則退出
    if (isReadingLoading.value) {
        return;
    }

    if (clickedCard.isDrawn === false) {
        // 1. 第一次點擊：抽取符文 (移動卡片)
        
        // 只有在沒有任何牌被翻開時，才能執行換牌邏輯
        const isAnyCardFlipped = shuffledCards.value.some(card => card.isFlipped);
        if (isAnyCardFlipped) {
            return; 
        }

        // 換牌邏輯：清除舊的抽取狀態，並設定新牌
        shuffledCards.value.forEach(card => card.isDrawn = false);
        clickedCard.isDrawn = true;
        drawnCardId.value = clickedCard.id; // 鎖定牌堆（用於視覺樣式）

    } else if (clickedCard.isDrawn === true && clickedCard.isFlipped === false) {
        // 2. 第二次點擊：翻面並顯示結果 (資料處理和紀錄)
        
        isReadingLoading.value = true;
        
        // 翻面
        clickedCard.isFlipped = true;

        // 模擬獲取 rune_general_meaning
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // 構造最終的顯示文本
        const orientation_status = clickedCard.isReversed ? '逆位' : '正位';
        
        // 使用資料表欄位，格式化為要求的樣式
        const finalReadingText = 
        `${clickedCard.full_name_zh} / ${clickedCard.full_name_en}
        
        ${clickedCard.general_meaning}`.trimStart();

        // 寫入卡片 info 欄位 (顯示結果)
        clickedCard.info = finalReadingText; 
        
        // 嘗試儲存紀錄 (API 記錄)
        await saveDivinationRecord(clickedCard, finalReadingText); 
        
        isReadingLoading.value = false;
    }
}

/**
 * 執行洗牌和重置動作
 */
function shuffleAndReset() {
    // 重置所有卡片狀態，並確保它們是從 initialCardDeck 中複製出來的
    const resetData = initialCardDeck.value.map(card => ({
        ...card, 
        isDrawn: false,
        isFlipped: false,
    }));
    
    // 確保 drawnCardId 是一個已定義的 ref
    drawnCardId.value = null; // 解鎖牌堆
    isReadingLoading.value = false;
    
    shuffledCards.value = shuffle(resetData);
}

/**
 * 重置回說明畫面
 */
function resetToInstruction() {
    showInstruction.value = true;
    shuffleAndReset();
}


// --- 輔助函數 ---
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getCardIndex = (index) => {
  return index - Math.floor(shuffledCards.value.length / 2);
};

const getCardZIndex = (index) => {
  return index;
};

// --- 生命週期鉤子 ---
onMounted(async () => {
  // 檢查登入狀態
  authStore.checkAuth(); 
    // *** 呼叫 API 抓取初始資料 ***
    await fetchAllRuneData(); 

    // 首次載入時，初始化牌組並洗牌 (只在資料載入成功時執行)
    if (allRuneData.value.length > 0) {
      initialCardDeck.value = select24RandomCards(allRuneData.value); 
      shuffleAndReset(); 
    }
});
</script>

<template>
  <video autoplay muted loop id="runesone-background-video">
    <source src="/src/assets/videos/BackgroundV04.mp4" type="video/mp4">
  </video>
  
  <div class="runesone-page-container">
    <!-- 漢堡選單(shared.css) -->
    <nav class="shared-hamburger-menu" :class="{ 'is-open': isMenuOpen }">
      <div class="shared-menu-header">
        <span class="shared-menu-title">占卜選單</span>
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
      </div>
      <ul class="shared-menu-links">
        <li><button @click="goHome">首頁</button></li>
        <li><button @click="goBookOfAnswers" >解答之書</button></li>
        <li><button @click="goRunesOne" class="is-current">盧恩符文 (單顆)</button></li>
        <li><button @click="goRunesTwo">盧恩符文 (雙顆)</button></li>
        <li><button @click="goFortuneStickOne">六十甲子籤</button></li>
        <li><button @click="goFortuneStickTwo">雷雨師百籤</button></li>
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
    <main class="runesone-main-content">
      <h1 class="runesone-title-chinese">盧恩符文：單字指引</h1>
      <h2 class="runesone-title-english">One-Rune Pull</h2>

      <div v-if="isDataLoading" class="runesone-loading-box">
          <h3>正在連結北歐諸神...</h3>
          <p>盧恩符文資料載入中，請稍候。</p>
      </div>

      <!-- 占卜方式說明 -->
      <div v-if="showInstruction" class="runesone-instruction-box">
          <h3>占卜方式說明</h3>
          <p>盧恩符文(Runes)，是北歐眾神之父奧丁（Odin）懸掛於世界樹上所換來的宇宙祕密與強大力量的載體，是一種古老的字母系統。</p>
          <p>本次占卜僅抽取「一顆」符文，直指您當前情境的核心命運建議。</p>
          <p>請在心中默想您的問題或想要專注的主題，準備好後，按下「開始占卜」。</p>
          
          <button class="runesone-start-btn" @click="startDivination" :disabled="isDataLoading">
            {{ isDataLoading ? '載入中...' : '開始占卜' }}
          </button>
      </div>

      <!-- 抽卡畫面 -->
      <div v-if="!showInstruction" class="runesone-card-shuffle-app">
        <div 
          class="runesone-container" 
          @mouseleave="isHovering = false" 
          @mouseenter="isHovering = true"
        >
          <div 
            v-for="(card, index) in shuffledCards" 
            :key="card.id"
            class="runesone-card-wrapper"
            :class="{ drawn: card.isDrawn, flipped: card.isFlipped }"
            :style="{ '--i': getCardIndex(index), zIndex: card.isDrawn ? 1000 : getCardZIndex(index) }"
            @click="handleCardClick(card)"
          >
            <div class="runesone-card-inner">
              <div class="runesone-card-face runesone-card-back">
                <img src="/src/assets/images/RunesCard/CardBack.png" alt="卡片背面">
              </div>
              <!-- 使用後端提供的 image 欄位 -->
              <div class="runesone-card-face runesone-card-front">
                <img :src="card.image" :alt="`卡片正面 ${card.full_name_en}`">
              </div>
            </div>
            
            <div v-if="card.isDrawn" class="runesone-info-box">
                <pre v-if="card.isFlipped" class="runesone-info-text">{{ card.info }}</pre>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="!showInstruction" class="runesone-action-buttons">
      <button class="runesone-shuffle-btn" @click="shuffleAndReset">
      洗牌 / 重新占卜
      </button>

      <button @click="resetToInstruction" class="runesone-btn-back">
      回到占卜方式說明
      </button>
    </div>
  </div>

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

</template>


<style scoped>
@import '/src/assets/styles/shared.css';
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* 防止出現水平滾動條 */
}

#runesone-background-video {
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

.runesone-page-container {
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

  .runesone-main-content {
    text-align: center;
    flex-grow: 1; 
    padding-top: 8px;
    width: 100%;
    max-width: 1000px;
  }

  .runesone-title-chinese {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: -10px;
    color: #222;
  }

  .runesone-title-english {
    font-size: 24px;
    font-weight: 300;
    color: #555;
    margin-bottom: 20px;
  }
  
  /* --- 占卜方式說明框樣式 --- */
  .runesone-instruction-box {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 30px;
    margin: 50px auto;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: left;
    color: #333;
    animation: fadeIn 0.5s ease-out;
  }

  .runesone-instruction-box h3 {
    text-align: center;
    color: #010305;
    margin-bottom: 20px;
    font-size: 24px;
    border-bottom: 2px solid #95989b;
    padding-bottom: 10px;
  }

  .runesone-instruction-box p {
    font-size: 18px;
    line-height: 1.8;
    margin-bottom: 15px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .runesone-loading-box {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 30px;
    margin: 50px auto;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    color: #333;
    animation: fadeIn 0.5s ease-out;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .runesone-loading-box h3 {
      color: #010305;
      margin-bottom: 10px;
      font-size: 24px;
  }

  .runesone-loading-box p {
      font-size: 16px;
      color: #555;
  }


  /* --- 開始占卜按鈕樣式 --- */
  .runesone-start-btn {
    display: block;
    width: 280px;
    max-width: 90%;
    margin: 30px auto 0 auto;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    background: linear-gradient(to right, #162b42, #bfb8e7);
    color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  .runesone-start-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  .runesone-start-btn:active {
    transform: translateY(0);
  }


  /* 抽卡樣式 */
  .runesone-card-shuffle-app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 320px;
    padding-bottom: 30px;
    overflow: visible;
    width: 100%;
  }

  /* --- Action Buttons 洗牌和回說明頁 動作按鈕 --- */
  .runesone-action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 100px;
    position: relative; 
    z-index: 10000;
  }

  /* --- 洗牌按鈕樣式 --- */
  .runesone-shuffle-btn {
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

 /* --- 回到說明頁按鈕樣式 --- */
  .runesone-btn-back {
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
    background-color: #000; 
    color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .runesone-shuffle-btn:hover,
  .runesone-btn-back:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  .runesone-shuffle-btn:active,
  .runesone-btn-back:active {
    transform: translateY(0);
  }

/* --- 容器樣式 --- */
.runesone-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 80px; 
    margin-top: -350px; 
}

/* --- 卡片包裝層 (控制位移與旋轉) --- */
.runesone-card-wrapper {
  position: absolute;
    top: 0;
    --card-width: 150px; 
    --card-height: 225px;
    width: var(--card-width);
    height: var(--card-height);
    transition: all 0.5s ease-in-out; 
    transform-origin: 50% 100%;
    perspective: 1000px;
    cursor: pointer;
}

/* 牌堆扇形展開效果 (透過 container 的 mouseenter/mouseleave 觸發) */
.runesone-container:hover .runesone-card-wrapper {
    transform: rotate(calc(var(--i) * 1deg))
      translate(calc(var(--i) * 30px), -50px);
}

/* 滑鼠移到卡片上時，該卡片向上移動 (未抽出的卡片) */
.runesone-container:hover .runesone-card-wrapper:hover:not(.drawn) {
    transform: rotate(calc(var(--i) * 1deg))
               translate(calc(var(--i) * 35px), -110px) !important;
    z-index: 100;
}

/* 被抽出的卡片 (第一次點擊: 拉出) */
.runesone-card-wrapper.drawn {
    transform: translate(0, -20px) scale(1.3) !important; /* 縮小抽出的位移和縮放 */
    z-index: 1000 !important;
    transition: all 0.5s ease-in-out; 
}

/* --- 翻面效果 --- */

/* 翻面狀態 */
.runesone-card-wrapper.flipped .runesone-card-inner {
    transform: rotateY(180deg);
}

.runesone-card-wrapper.drawn.flipped {
    transform: translate(-200px, -20px) scale(1.3) !important;
}

/* 卡片內部容器 (控制 3D 翻轉) */
.runesone-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

/* 卡片正反面共同樣式 */
.runesone-card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden; 
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

/* 確保卡片內的圖片也能正確顯示 */
.runesone-card-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

/* 背面樣式 */
.runesone-card-back {
    box-shadow: 0 8px 5px rgba(150, 150, 150, 0.1);
}

/* 正面樣式 */
.runesone-card-front {
    background-color: rgb(116, 116, 116); 
    transform: rotateY(180deg); 
    box-shadow: 0 8px 5px rgba(150, 150, 150, 0.1);
}

/* --- 資訊框樣式 --- */
.runesone-info-box {
    position: absolute;
    top: 0;
    left: 100%;
    transform: translateX(20px);
    width: var(--card-width);
    height: 185px;
    background: rgba(255, 255, 255, 0.95);
    color: black;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s, transform 0.5s;
    pointer-events: none;
    min-width: 300px;
    text-align: left;
    font-size: 1em;
    z-index: 1;
    box-sizing: border-box; 
}

/* 翻面後顯示資訊 */
.runesone-card-wrapper.drawn.flipped .runesone-info-box {
    opacity: 1;
    pointer-events: auto;
}

.runesone-info-text {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: inherit; 
}


/* --- RWD --- */
@media (max-width: 768px) {
    /* 在小螢幕上，卡片垂直堆疊，資訊框移到卡片下方 */
    .runesone-card-wrapper.drawn {
        transform: translate(0, -20px) scale(1.3) !important; /* 移回中央 */
    }

    .runesone-info-box {
        top: calc(var(--card-height) * 1.3 + 30px); /* 位於放大後卡片下方 30px 處 */
        left: 50%;
        transform: translateX(-50%);
        width: calc(150px * 1.3); /* 資訊框寬度與卡片放大後一致 */
        height: auto; /* 允許高度自適應 */
    }

    .runesone-card-wrapper.drawn.flipped .runesone-info-box {
        left: 50%;
        transform: translateX(-50%);
    }

    .runesone-container {
        padding-bottom: 500px; /* 增加底部空間以容納資訊框 */
        margin-top: -300px; 
    }
}


/* --- Modal 相關樣式 (雖然移除了 Modal，但保留了通用動畫) --- */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}



</style>
