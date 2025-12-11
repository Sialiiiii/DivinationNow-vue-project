<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; 
import { useDivinationStore } from '../stores/divination'; 

// *** 1. 引入 API 服務 ***
import { fetchRuneData } from '@/services/runes'; // 引入基礎符文資料 (rune_orientation)
import { fetchSpecificRuneReading, saveRuneDoubleLog } from '@/services/runesTwo'; // 引入雙顆專屬 API

const router = useRouter();
const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
 };
const divStore = useDivinationStore();

if (!router) {
 console.error('Router is not available!');
}

// --- 狀態管理--
const showInstruction = ref(true); 
const isMenuOpen = ref(false); 
const drawnCards = ref([]); 
const showResultModal = ref(false); 

const isReadingLoading = ref(false); // 占卜結果是否正在從後端獲取中
const isHovering = ref(false); // 控制卡片 hover 效果

// *** 資料狀態管理 ***
const isDataLoading = ref(true); 
const allRuneData = ref([]); 

const fullCardDeck = ref([]); 
const shuffledCards = ref([]);


const hasDrawnTwoCards = computed(() => drawnCards.value.length === 2);

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
  router.push('/RunesOneDivination');
}
const goRunesTwo = () => {
  isMenuOpen.value = false;
  resetToInstruction();
}
const goFortuneStickOne = () => {
  isMenuOpen.value = false;
  router.push('/FortuneStickOneDivination');
}
const goFortuneStickTwo = () => {
  isMenuOpen.value = false;
  router.push('/FortuneStickTwoDivination');
}


async function fetchAllRuneData() {
  isDataLoading.value = true;
  try {
    const apiData = await fetchRuneData(); 

    // 🚀 修正點：確保所有需要的名稱欄位加入 formattedData
    const formattedData = apiData.map(item => ({
      id: item.orientation_id, 
      original_orientation_id: item.orientation_id, 
      full_name_zh: item.full_name_zh, // 確保中文名存在
      full_name_en: item.full_name_en, // 確保英文名存在
      front: item.full_name_zh, // 顯示中文名 (用於卡片正面暫存)
      image: item.rune_image_url, 
      isReversed: item.is_reversed === 1, 
      general_meaning: item.rune_general_meaning, 
      isDrawn: false, 
      isFlipped: false,
      readingText: null,
    }));
    
    allRuneData.value = formattedData;
    fullCardDeck.value = formattedData; 

  } catch (error) {
    console.error('Initial rune data fetch failed:', error);
    alert('無法載入盧恩符文資料，請檢查網路連線或後端服務。');
  } finally {
    isDataLoading.value = false;
  }
}

/**
* [NEW] 紀錄雙顆符文占卜結果
*/
async function saveDoubleDivinationRecord(rune1Id, rune2Id, statusId) {
  if (!authStore.isAuthenticated) {
    console.log('[未登入] 占卜結果未記錄。');
    return;
  }
  // 🚀 修正點：確保獲取 user_id (假設您的 authStore 中有 user.user_id 欄位)
  const userId = authStore.user?.user_id; 
  if (!userId) {
    console.error('[紀錄失敗] 缺少 user_id。');
    return;
  }

  try {
    // 呼叫 API 服務
    const result = await saveRuneDoubleLog(userId, rune1Id, rune2Id, statusId);
    console.log(`[紀錄成功] 雙顆符文紀錄完成。Log ID: ${result.log_id || 'N/A'}`);
  } catch (error) {
    console.error(`[紀錄失敗] 發生錯誤:`, error);
  }
}

/**
* 【API 串接點 】實際發 API 查詢符文解釋
* @param {number} orientationId - 符文正逆位 ID (card.original_orientation_id)
* @param {number} statusId - 狀態 ID (INT)
* @param {number} position - 牌位: 1=現況/基礎, 0=建議/指引
*/
async function fetchRuneReading(orientationId, statusId, position) {
  try {
    const response = await fetchSpecificRuneReading(orientationId, statusId, position);
    
    // 組合牌位名稱和狀態中文標籤
    const positionName = position === 1 ? '現況/基礎' : '建議/指引';
    
    // 這裡 runeData 必須包含 full_name_zh, full_name_en 等屬性 (已在 fetchAllRuneData 修正)
    const runeData = allRuneData.value.find(r => r.original_orientation_id === orientationId);
    
        // 🚀 偵錯點：輸出 runeData 內容，檢查 full_name_zh 是否存在
        console.log(`DEBUG: Rune Data for ID ${orientationId}:`, runeData);

    const orientation = runeData?.isReversed ? '逆位 (R)' : '正位 (U)';
    const runeName = runeData?.full_name_zh || '未知符文'; // 使用修正後的 runeName
    
    // 檢查是否有特定解讀 (response.interpretation_text)
    const interpretation = response.interpretation_text || runeData?.general_meaning || '目前無特定解讀，請參考通用解釋。';
    
    const finalReadingText = `
${runeName} / ${runeData?.full_name_en || 'Unknown'}
---------
${interpretation}
    `.trimStart();

    return finalReadingText;
    
  } catch (error) {
    console.error('Fetching rune reading failed:', error);
    return `API 查詢失敗：${error.message}`;
  }
}


// --- 流程控制函數 ---

function startDivination() {
 // *** 新增檢查：如果資料未載入完成，則不開始 ***
 if (isDataLoading.value || allRuneData.value.length === 0) {
   console.warn("Rune data not loaded yet. Cannot start divination.");
   return;
 }
 divStore.showTopicModal = true;
}

/**
* 處理使用者選擇主題後的邏輯
*/
function handleSelectTopic(topic) {
 divStore.setTopic(topic);
 if (authStore.isAuthenticated) {
  let statusId = (topic === '事業') ? authStore.getUserCareerStatusId : authStore.getUserRelationshipStatusId;
  
  if (statusId) {
   divStore.setStatus(statusId);
  } else {
   // 如果會員資料裡沒有 Status ID (null)，則彈出 Modal 讓使用者手動選擇
   divStore.showStatusModal = true; 
  }
 } else {
  divStore.showStatusModal = true;
 }
}

/**
* 處理未登入使用者選擇狀態後的邏輯 (傳遞 Status ID)
*/
function handleSelectStatus(statusId) {
 divStore.setStatus(statusId); 
}

// 監聽 Pinia 狀態，當流程準備好時進入抽卡畫面
const watchReadyToDraw = computed(() => divStore.isReadyToDraw);

watch(watchReadyToDraw, (isReady) => {
 if (isReady && !isDataLoading.value) { 
  showInstruction.value = false;
  shuffleAndReset();
 }
});


/**
* 處理卡片點擊事件 (抽牌/翻牌邏輯) 
*/
async function handleCardClick(clickedCard) {
 if (hasDrawnTwoCards.value || clickedCard.isDrawn || isReadingLoading.value) { 
  return;
 }
 
 clickedCard.isDrawn = true;
 clickedCard.isFlipped = true;

 // 將卡片加入已抽取列表
 drawnCards.value.push(clickedCard);

 if (drawnCards.value.length === 2) {
  isReadingLoading.value = true;

  // 使用 Promise.resolve/reject 來處理 setTimeout 的異步邏輯，確保等待完成
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  try {
   const statusId = divStore.chosenStatus; // 使用 Status ID
   if (!statusId) {
    console.error("錯誤：Status ID 未設定，無法查詢。");
    isReadingLoading.value = false;
    return;
   }

   // 取得兩張牌的原始 orientation ID
   const rune1OrientationId = drawnCards.value[0].original_orientation_id; 
   const rune2OrientationId = drawnCards.value[1].original_orientation_id; 

   // 異步獲取兩張牌的解釋 (呼叫 API 服務)
   const results = await Promise.all([
    // 第一張牌：現況/基礎 (position = 1)
    fetchRuneReading(rune1OrientationId, statusId, 1),
    // 第二張牌：建議/指引 (position = 2) 🚀 關鍵修正點：修正為資料庫期望的 2
    fetchRuneReading(rune2OrientationId, statusId, 2)
   ]);

   // 將結果存回 drawnCards
   drawnCards.value[0].readingText = results[0];
   drawnCards.value[1].readingText = results[1];

   // *** 紀錄 API 呼叫 (在結果出來後執行) ***
   await saveDoubleDivinationRecord(rune1OrientationId, rune2OrientationId, statusId);

   isReadingLoading.value = false;
   showResultModal.value = true;
  } catch (error) {
        console.error('Error in handleCardClick API call:', error);
        isReadingLoading.value = false;
    }
 }
}


/**
* 執行洗牌和重置動作 
*/
function shuffleAndReset() {
 // *** 確保資料已載入 ***
 if (fullCardDeck.value.length === 0) {
   return; 
 }
 const selected24Cards = selectRandomCards(fullCardDeck.value, 24); // *** 使用 fullCardDeck.value ***
 
 const resetData = selected24Cards.map(card => ({
  ...card,
  isDrawn: false,
  isFlipped: false,
  readingText: null // 重置解釋
 }));

 drawnCards.value = [];
 showResultModal.value = false;
 isReadingLoading.value = false; // 重置加載狀態

 shuffledCards.value = shuffle(resetData);
}


// --- 輔助函數 ---

function resetToInstruction() {
  showInstruction.value = true;
  shuffleAndReset();
  divStore.resetFlow(); 
}

function closeResultModal() {
  showResultModal.value = false;
  shuffleAndReset(); 
  divStore.resetFlow(); 
}

const getCardInfo = (card) => {
  if (!card.readingText) {
    return isReadingLoading.value ? '載入中...' : '請點擊卡片，等待解讀';
  }
  return card.readingText;
};

function selectRandomCards(array, count) {
  const deck = [...array];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
}
function shuffle(array) {
 const arr = [...array];
 for (let i = arr.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [arr[i], arr[j]] = [arr[j], arr[i]];
 }
 return arr;
}
const getCardIndex = (index) => { return index - Math.floor(shuffledCards.value.length / 2); };
const getCardZIndex = (index) => { return index; };

// --- 生命週期鉤子 ---
onMounted(async () => {
 authStore.checkAuth();
 await fetchAllRuneData(); 

 // 如果資料抓取成功，則初始化洗牌
 if (allRuneData.value.length > 0) {
  shuffleAndReset(); 
 }
});
</script>

<template>
  <video autoplay muted loop id="runestwo-background-video">
    <source src="/src/assets/videos/BackgroundV04.mp4" type="video/mp4">
  </video>
  
  <div class="runestwo-page-container">
    <nav class="shared-hamburger-menu" :class="{ 'is-open': isMenuOpen }">
      <div class="shared-menu-header">
        <span class="shared-menu-title">占卜選單</span>
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
      </div>
      <ul class="shared-menu-links">
        <li><button @click="goHome">首頁</button></li>
        <li><button @click="goBookOfAnswers" >解答之書</button></li>
        <li><button @click="goRunesOne">盧恩符文 (單顆)</button></li>
        <li><button @click="goRunesTwo" class="is-current">盧恩符文 (雙顆)</button></li>
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

    <main class="runestwo-main-content">
      <h1 class="runestwo-title-chinese">盧恩符文：雙字指引</h1>
      <h2 class="runestwo-title-english">Two-Rune Pull</h2>

      <div v-if="isDataLoading" class="runestwo-instruction-box runes-loading-box">
          <h3>正在連結北歐諸神...</h3>
          <p>盧恩符文資料載入中，請稍候。</p>
      </div>

      <div v-if="showInstruction" class="runestwo-instruction-box">
          <h3>占卜方式說明</h3>
          <p>盧恩符文(Runes)，是北歐眾神之父奧丁（Odin）懸掛於世界樹上所換來的宇宙祕密與強大力量的載體，是一種古老的字母系統。</p>
          <p>本次占卜僅抽取「兩顆」符文，直指您當前情境的核心命運建議。</p>
          <p>請在心中默想您的問題或想要專注的主題，準備好後，按下「開始占卜」。</p>
          
          <button class="runestwo-start-btn" @click="startDivination" :disabled="isDataLoading">
            {{ isDataLoading ? '載入中...' : '開始占卜' }}
          </button>
      </div>

      <div v-if="!showInstruction" class="runestwo-card-shuffle-app">
        
        <p v-if="isReadingLoading" class="loading-message">
            🔮 正在獲取符文解讀結果...
        </p>

        <div class="runestwo-container"
          @mouseleave="isHovering = false"
          @mouseenter="isHovering = true">
          <div v-for="(card, index) in shuffledCards"
            :key="card.id" class="runestwo-card-wrapper"
            :class="{
              'drawn': card.isDrawn,
              'flipped': card.isFlipped,
              'drawn-left': card.isDrawn && drawnCards[0] && card.id === drawnCards[0].id,
              'drawn-right': card.isDrawn && drawnCards[1] && card.id === drawnCards[1].id,
            }"
            :style="{ '--i': getCardIndex(index), zIndex: card.isDrawn ? (card.id === drawnCards[0]?.id ? 1000 : 1001) : getCardZIndex(index) }"
            @click="handleCardClick(card)"
             >
            <div class="runestwo-card-inner">
              <div class="runestwo-card-face runestwo-card-back">
                <img src="/src/assets/images/RunesCard/CardBack.png" alt="卡片背面">
              </div>
              <div class="runestwo-card-face runestwo-card-front">
                <img :src="card.image" :alt="`卡片正面 ${card.front}`">
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 占卜主題選擇 Modal (Pinia 控制) -->
    <div v-if="divStore.showTopicModal" class="runestwo-result-modal-overlay topic-modal-overlay">
      <div class="runestwo-result-modal topic-modal">
        <h3>選擇占卜主題</h3>
        <div class="topic-selection-buttons">
          <button class="runestwo-start-btn topic-btn" @click="handleSelectTopic('事業')">
            💼 關於事業/學業
          </button>
          <button class="runestwo-start-btn topic-btn" @click="handleSelectTopic('感情')">
            ❤️ 關於感情/愛情
          </button>
        </div>
      </div>
    </div>

    <!-- 占卜狀態選擇 Modal (Pinia 控制) -->
    <div v-if="divStore.showStatusModal" class="runestwo-result-modal-overlay status-modal-overlay">
      <div class="runestwo-result-modal topic-modal">
        <h3>請選擇您的【{{ divStore.currentTopic }}】狀態</h3>
        
        <div class="topic-selection-buttons">
          <!-- 遍歷 Pinia 中的狀態選項，傳遞 ID -->
          <button v-for="option in divStore.getStatusOptions" :key="option.id" 
                  class="runestwo-start-btn topic-btn status-btn" 
                  @click="handleSelectStatus(option.id)"> 
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>


    <div v-if="!showInstruction && !showResultModal" class="runestwo-action-buttons">
      <button class="runestwo-shuffle-btn" @click="shuffleAndReset">
        洗牌
      </button>

      <button @click="resetToInstruction" class="runestwo-btn-back">
        回到占卜方式說明
      </button>
    </div>

    <!-- 占卜結果 Modal (Pinia 狀態顯示) -->
    <div v-if="showResultModal" class="runestwo-result-modal-overlay">
      <div class="runestwo-result-modal">
        <h3>🔮 盧恩符文占卜結果 (主題: {{ divStore.currentTopic }} / 狀態: {{ divStore.getStatusLabel(divStore.chosenStatus) }}) 🔮</h3> 
        <div class="runestwo-result-cards-display">
          <div class="runestwo-result-card-item">
            <h4>第一張牌 (現況/基礎)</h4>
            <img :src="drawnCards[0].image" alt="第一張牌" class="runestwo-result-card-image">
            <pre class="runestwo-result-card-info">{{ getCardInfo(drawnCards[0]) }}</pre>
          </div>
          <div class="runestwo-result-card-item">
            <h4>第二張牌 (建議/指引)</h4>
            <img :src="drawnCards[1].image" alt="第二張牌" class="runestwo-result-card-image">
            <pre class="runestwo-result-card-info">{{ getCardInfo(drawnCards[1]) }}</pre>
          </div>
        </div>
        
        <button class="runestwo-start-btn" @click="closeResultModal">
          重新開始占卜
        </button>
      </div>
    </div>

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
    overflow-x: hidden; 
}

#runestwo-background-video {
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

.runestwo-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #222;
    min-height: 100vh;
    width: 100%;
    position: relative; 
    z-index: 1;
    font-family: 'Microsoft JhengHei', 'Heiti TC', sans-serif;
}

  .runestwo-main-content {
    text-align: center;
    flex-grow: 1; 
    padding-top: 8px;
    width: 100%;
    max-width: 1000px;
  }

  .runestwo-title-chinese {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: -10px;
    color: #222;
  }

  .runestwo-title-english {
    font-size: 24px;
    font-weight: 300;
    color: #555;
    margin-bottom: 20px;
  }


  /* --- 占卜方式說明框樣式 --- */
  .runestwo-instruction-box {
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

  .runestwo-instruction-box h3 {
    text-align: center;
    color: #010305;
    margin-bottom: 20px;
    font-size: 24px;
    border-bottom: 2px solid #95989b;
    padding-bottom: 10px;
  }

  .runestwo-instruction-box p {
    font-size: 18px;
    line-height: 1.8;
    margin-bottom: 15px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .runes-loading-box {
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

/* --- 新增/修正: Modal 樣式 --- */
.topic-modal-overlay {
    /* 繼承 runestwo-result-modal-overlay */
}

.topic-modal {
    max-width: 500px;
}

.topic-modal p {
    font-size: 18px;
    margin-bottom: 20px;
}

.topic-selection-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    margin-bottom: 40px;
}

.topic-btn {
    width: 90%;
    max-width: 300px;
}

.runestwo-result-modal h3 {
    color: #2a3a5e;
    margin-bottom: 5px;
    font-size: 28px;
}

  /* --- 開始占卜按鈕樣式 --- */
  .runestwo-start-btn {
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
  .runestwo-start-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  .runestwo-start-btn:active {
    transform: translateY(0);
  }

/* --- 狀態選擇 Modal 樣式 --- */
.status-btn {
    /* 狀態按鈕使用綠色系，與主題按鈕區分 */
    background: linear-gradient(to right, #343a4b, #c0c0c9); 
}
.status-btn:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    transform: translateY(-3px);
}


  /* 抽卡樣式 */
  .runestwo-card-shuffle-app {
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
  .runestwo-action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 100px;
    position: relative; 
    z-index: 10000;
  }

  /* --- 洗牌按鈕樣式 --- */
  .runestwo-shuffle-btn {
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
  .runestwo-btn-back {
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

  .runestwo-shuffle-btn:hover,
  .runestwo-btn-back:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  .runestwo-shuffle-btn:active,
  .runestwo-btn-back:active {
    transform: translateY(0);
  }

/* --- 容器樣式 --- */
.runestwo-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 80px; 
    margin-top: -350px; 
}

/* --- 卡片包裝層 (控制位移與旋轉) --- */
.runestwo-card-wrapper {
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
.runestwo-container:hover .runestwo-card-wrapper {
    transform: rotate(calc(var(--i) * 1deg))
      translate(calc(var(--i) * 30px), -50px);
}

/* 滑鼠移到卡片上時，該卡片向上移動 (未抽出的卡片) */
.runestwo-container:hover .runestwo-card-wrapper:hover:not(.drawn) {
    transform: rotate(calc(var(--i) * 1deg))
              translate(calc(var(--i) * 35px), -80px) !important;
    z-index: 100;
}

/* 被抽出的卡片 (第一次點擊: 拉出) */
.runestwo-card-wrapper.drawn {
    transform: translate(0, -20px) scale(1.3) !important; 
    z-index: 1000 !important;
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 第一張抽出的卡片：移動到左邊 */
.runestwo-card-wrapper.drawn.drawn-left {
    transform: translate(-450px, -220px) scale(0.7) !important;
}

/* 第二張抽出的卡片：移動到右邊 */
.runestwo-card-wrapper.drawn.drawn-right {
    transform: translate(450px, -220px) scale(0.7) !important;
}

/* 翻面狀態 (因為一抽就翻，所以這個樣式會立即應用在 drawn 卡片上) */
.runestwo-card-wrapper.flipped .runestwo-card-inner {
    transform: rotateY(180deg);
}

/* 卡片內部容器 (控制 3D 翻轉) */
.runestwo-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}


/* 卡片正反面共同樣式 */
.runestwo-card-face {
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
.runestwo-card-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

/* 背面樣式 */
.runestwo-card-back {
    box-shadow: 0 8px 5px rgba(150, 150, 150, 0.1);
}

/* 正面樣式 */
.runestwo-card-front {
    background-color: rgb(116, 116, 116); 
    transform: rotateY(180deg); 
    box-shadow: 0 8px 5px rgba(150, 150, 150, 0.1);
}

/* --- 結果說明框樣式 --- */
.runestwo-result-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: modalFadeIn 0.3s ease-out;
}

.runestwo-result-modal {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 1px;
    max-width: 800px;
    width: 100%;
    max-height: 600px;
    box-sizing: border-box;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #333;
    transform: scale(0.8);
    animation: modalZoomIn 0.5s forwards;
}

.runestwo-result-cards-display {
    display: flex;
    justify-content: space-around;
    gap: 10px;
    /* margin-bottom: 10px; */
    flex-wrap: wrap; 
}

.runestwo-result-card-item {
    flex: 1;
    max-width: 330px;
    background: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.runestwo-result-card-item h4 {
    color: #555;
    margin-top: 0;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
}

.runestwo-result-card-image {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
    margin: -5px 0;
    border: 1px solid #eee;
}

.runestwo-result-card-info {
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
    color: #222;
    min-height: 100px; 
    width: 300px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: inherit; 
}


@keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalZoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}


/* RWD */
@media (max-width: 768px) {
    .runestwo-result-cards-display {
        flex-direction: column;
        gap: 30px;
    }
    .runestwo-result-card-item {
        max-width: 100%; 
        flex-basis: 100%;
        margin: 0; 
    }
    .runestwo-result-modal {
        padding: 20px; 
    }
}
</style>