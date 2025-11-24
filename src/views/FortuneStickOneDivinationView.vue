<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const fortuneSticks = Array.from({ length: 60 }, (_, i) => {
  const index = i + 1;
  const stickNumber = String(index).padStart(2, '0'); // 籤號 01-60
  return {
    id: index,
    number: stickNumber,
    title: `第 ${index} 籤`,
    theme: `甲子籤詩主題 ${index}`,
    text: `這是六十甲子籤第 ${index} 籤的籤詩內容。請詳細說明您所問之事，並得到神明的指引。`,
    imageUrl: `/src/assets/images/StickOne/StickOne${stickNumber}.png`
  };
});

// --- 狀態管理 ---
// 占卜流程：'instruction' -> 'pai_toss' -> 'draw_stick' -> 'result'
const divinationStep = ref('instruction'); 
const isMenuOpen = ref(false); // 漢堡選單
const paiResult = ref(null); // 擲筊結果: 'shengbai' | 'xiaobai' | 'yinbai' | null
const drawnStick = ref(null); // 抽到的籤詩物件
const showResultModal = ref(false); // 控制是否顯示結果說明框

// 計算屬性：當前流程
const isPaiTossPhase = computed(() => divinationStep.value === 'pai_toss');
const isDrawStickPhase = computed(() => divinationStep.value === 'draw_stick');


// --- 漢堡選單 ---
const goHome = () => {
      isMenuOpen.value = false; // 關閉選單
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
      router.push('/RunesTwoDivination');
  }
  const goFortuneStickOne = () => {
      isMenuOpen.value = false;
      resetToInstruction();
  }
  const goFortuneStickTwo = () => {
      isMenuOpen.value = false;
      router.push('/FortuneStickTwoDivination');
  }


// --- 邏輯函數 ---

/**
 * 開始占卜：從說明切換到擲筊階段
 */
function startDivination() {
  divinationStep.value = 'pai_toss'; // 切換到擲筊畫面
  paiResult.value = null; // 重置結果
  drawnStick.value = null; // 重置籤詩
  showResultModal.value = false;
}

/**
 * 重置回說明畫面
 */
function resetToInstruction() {
  divinationStep.value = 'instruction';
  paiResult.value = null;
  drawnStick.value = null;
  showResultModal.value = false;
}

/**
 * 模擬擲筊動作
 * @returns {string} 'shengbai' (聖杯) | 'xiaobai' (笑杯) | 'yinbai' (陰杯)
 */
function tossPai() {
  // 模擬兩個筊的結果：0=陰面(平面), 1=陽面(凸面)
  const pai1 = Math.round(Math.random());
  const pai2 = Math.round(Math.random());

  if (pai1 !== pai2) {
    // 一陰一陽 (1-0 或 0-1) => 聖杯 (Shengbai)
    return 'shengbai';
  } else if (pai1 === 0 && pai2 === 0) {
    // 兩陰面 (0-0) => 陰杯 (Yinbai)
    return 'yinbai';
  } else {
    // 兩陽面 (1-1) => 笑杯 (Xiaobai)
    return 'xiaobai';
  }
}

/**
 * 處理擲筊點擊事件
 */
function handlePaiToss() {
  const result = tossPai();
  paiResult.value = result;

  // 延遲顯示結果，模擬擲筊動畫
  setTimeout(() => {
    // 聖杯：進入抽籤階段
    if (result === 'shengbai') {
      divinationStep.value = 'draw_stick';
    } 
    // 笑杯/陰杯：流程保持在擲筊階段，等待重新擲筊
    // 不需要額外操作，使用者看到結果後會再點擊「重新擲筊」
  }, 1000); 
}

/**
 * 模擬抽取籤詩
 */
function drawStick() {
  if (drawnStick.value) return; // 已經抽過就不能再抽

  // 隨機選取一支籤 (從 0 到 59)
  const randomIndex = Math.floor(Math.random() * fortuneSticks.length);
  const stick = fortuneSticks[randomIndex];
  
  drawnStick.value = stick;

  // 顯示結果框
  setTimeout(() => {
    showResultModal.value = true;
  }, 1500); 
}

/**
 * 重新開始占卜 (從結果框)
 */
function closeResultModal() {
  showResultModal.value = false;
  // 重置回擲筊階段，讓使用者重新提問和擲筊
  startDivination(); 
}

// --- 生命週期鉤子 (保持不變) ---
onMounted(() => {
  // 初始化時保持在說明頁
  resetToInstruction();
});
</script>

<template>
  <video autoplay muted loop id="fortunestick-background-video">
    <source src="/src/assets/videos/BackgroundV04.mp4" type="video/mp4">
  </video>
  
  <div class="fortunestick-page-container">
    <nav class="shared-hamburger-menu" :class="{ 'is-open': isMenuOpen }">
      <div class="shared-menu-header">
        <span class="shared-menu-title">占卜選單</span>
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
      </div>
      <ul class="shared-menu-links">
        <li><button @click="goHome">首頁</button></li>
        <li><button @click="goBookOfAnswers" >解答之書</button></li>
        <li><button @click="goRunesOne">盧恩符文 (單顆)</button></li>
        <li><button @click="goRunesTwo">盧恩符文 (雙顆)</button></li>
        <li><button @click="goFortuneStickOne" class="is-current">六十甲子籤</button></li>
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
            <a href="#" class="shared-btn-logout">登出</a> 
          </div>
      </div>
    </header>

    <main class="fortunestick-main-content">
      <h1 class="fortunestick-title-chinese">六十甲子籤</h1>
      <h2 class="fortunestick-title-english">Fortune Stick Divination</h2>

      <div v-if="divinationStep === 'instruction'" class="fortunestick-instruction-box">
          <h3>占卜流程說明</h3>
          <p>請先向神明稟告您的姓名、生辰、居住地，以及想請示的問題，務必清晰、誠懇。</p>
          <p>流程為：擲筊 → 得到聖杯 → 抽籤 → 解籤。</p>
          <p>擲筊結果：</p>
          <ul>
            <li>聖杯 (一正一反)：神明應允，可以進行下一步抽籤。</li>
            <li>笑杯 (兩凸面)：神明不解您的問題或笑您問得太籠統，請重新向神明說明。</li>
            <li>陰杯 (兩平面)：神明不允，所問之事不合時宜或方向錯誤，請重新調整問題。</li>
          </ul>
          
          <button class="fortunestick-start-btn" @click="startDivination">
              開始請示 (擲筊)
          </button>
      </div>

      <div v-else-if="isPaiTossPhase" class="fortunestick-pai-toss-area">
        <h3> 稟告神明後，請擲筊請示 </h3>
        <p class="fortunestick-prompt">請專注思考您的問題，然後點擊「擲筊」按鈕。</p>

        <div class="fortunestick-pai-display" :class="{ 'has-result': paiResult }">
          <div class="fortunestick-pai-image-wrapper">
            <img src="/src/assets/images/moonblocks.png" alt="筊杯" class="fortunestick-pai-image">
            <img src="/src/assets/images/moonblocks.png" alt="筊杯" class="fortunestick-pai-image">
          </div>
          
          <div v-if="paiResult" class="fortunestick-result-message" :class="paiResult">
            <template v-if="paiResult === 'shengbai'">
              <span class="result-icon">✅</span>
              <h4>聖杯！神明應允，請準備抽籤！</h4>
            </template>
            <template v-else-if="paiResult === 'xiaobai'">
              <span class="result-icon">❓</span>
              <h4>笑杯。神明不解，請將問題說得更清楚，然後重新擲筊。</h4>
            </template>
            <template v-else-if="paiResult === 'yinbai'">
              <span class="result-icon">❌</span>
              <h4>陰杯。神明不允，請重新調整方向或問題，然後重新擲筊。</h4>
            </template>
          </div>
        </div>

        <button class="fortunestick-toss-btn" 
                @click="handlePaiToss" 
                :disabled="!isPaiTossPhase || showResultModal"
        >
          {{ paiResult ? '重新擲筊' : '擲筊' }}
        </button>

        <button @click="resetToInstruction" class="fortunestick-btn-back">
          回到占卜方式說明
        </button>
      </div>

      <div v-else-if="isDrawStickPhase" class="fortunestick-draw-stick-area">
        <h3>✨ 聖杯已得，請抽籤 ✨</h3>
        <p class="fortunestick-prompt">點擊籤筒抽取一支籤。</p>

        <div class="fortunestick-stick-container" @click="drawStick">
            <img src="/src/assets/images/FortuneStickContainer.png" alt="籤筒" class="fortunestick-stick-image-container">
            <div class="fortunestick-stick-draw-btn">點擊抽籤</div>
        </div>
        
        <p v-if="drawnStick" class="fortunestick-drawn-info">已抽出：{{ drawnStick.title }}</p>

        <button @click="startDivination" class="fortunestick-btn-back">
          重新請示 (回到擲筊)
        </button>
      </div>
    </main>

    <div v-if="showResultModal" class="fortunestick-result-modal-overlay">
      <div class="fortunestick-result-modal">
        <h3>{{ drawnStick.title }} 籤詩結果</h3>
        <div class="fortunestick-result-display">
          <img :src="drawnStick.imageUrl" alt="籤詩圖片" class="fortunestick-result-image">
          <div class="fortunestick-result-info">
            <h4>【語意】</h4>
            <p>{{ drawnStick.text }}</p>
            <h4>【籤意】</h4>
            <p>{{ drawnStick.theme }}</p>
          </div>
        </div>
        
        <button class="fortunestick-start-btn" @click="closeResultModal">
          重新開始請示
        </button>
      </div>
    </div>

    <footer class="shared-footer">
      <div class="shared-footer-content">
        </div>
      <div class="shared-footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Divination. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import '/src/assets/styles/shared.css';

/* 背景影片與容器基礎樣式保留，但類別名稱調整 */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

#fortunestick-background-video {
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

.fortunestick-page-container {
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

.fortunestick-main-content {
    text-align: center;
    flex-grow: 1; 
    padding-top: 8px;
    width: 100%;
    max-width: 1000px;
}

.fortunestick-title-chinese {
    font-size: 36px;
    font-weight: 400;
    margin-bottom: -10px;
    color: #fff; /* 調整顏色以在影片背景上更清晰 */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.fortunestick-title-english {
    font-size: 24px;
    font-weight: 300;
    color: #ccc;
    margin-bottom: 20px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}


/* --- 占卜方式說明框樣式 --- */
.fortunestick-instruction-box {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 30px;
    margin: 50px auto;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: left;
    color: #333;
    animation: fadeIn 0.5s ease-out;
}

.fortunestick-instruction-box h3 {
    text-align: center;
    color: #a0522d; /* 廟宇的感覺 */
    margin-bottom: 20px;
    font-size: 24px;
    border-bottom: 2px solid #a0522d;
    padding-bottom: 10px;
}

.fortunestick-instruction-box p {
    font-size: 18px;
    line-height: 1.8;
    margin-bottom: 15px;
}
.fortunestick-instruction-box ul {
    list-style: none;
    padding-left: 0;
    margin-top: 15px;
}
.fortunestick-instruction-box li {
    background: #f0f0f0;
    padding: 8px 15px;
    border-left: 5px solid #a0522d;
    margin-bottom: 8px;
    border-radius: 5px;
    font-size: 16px;
}
.fortunestick-instruction-box li strong {
    color: #d2691e;
}

/* --- 開始請示按鈕樣式 (共用) --- */
.fortunestick-start-btn, .fortunestick-toss-btn {
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
    background: linear-gradient(to right, #a0522d, #d2691e); /* 廟宇的金棕色系 */
    color: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.fortunestick-start-btn:hover, .fortunestick-toss-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}
.fortunestick-start-btn:active, .fortunestick-toss-btn:active {
    transform: translateY(0);
}
.fortunestick-toss-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* --- 擲筊畫面樣式 --- */
.fortunestick-pai-toss-area {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 30px;
    margin: 50px auto;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #333;
    animation: fadeIn 0.5s ease-out;
}
.fortunestick-pai-toss-area h3 {
    color: #a0522d;
}
.fortunestick-prompt {
    font-size: 18px;
    color: #555;
    margin-bottom: 20px;
}
.fortunestick-pai-display {
    min-height: 250px;
    margin-bottom: 20px;
    transition: all 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.fortunestick-pai-image-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}
.fortunestick-pai-image {
    width: 100px;
    height: auto;
    opacity: 0.5; /* 初始較暗 */
}
.fortunestick-pai-display.has-result .fortunestick-pai-image {
    opacity: 1; /* 擲筊後變亮 */
}
.fortunestick-result-message {
    padding: 15px;
    border-radius: 8px;
    width: 90%;
    margin-top: 20px;
}
.fortunestick-result-message h4 {
    margin: 0;
    font-size: 20px;
}
.fortunestick-result-message .result-icon {
    font-size: 30px;
    display: block;
    margin-bottom: 10px;
}
.shengbai { background-color: #e6ffe6; color: #1e8449; border: 2px solid #1e8449; }
.xiaobai { background-color: #fffbe6; color: #f39c12; border: 2px solid #f39c12; }
.yinbai { background-color: #ffe6e6; color: #c0392b; border: 2px solid #c0392b; }


/* --- 抽籤畫面樣式 --- */
.fortunestick-draw-stick-area {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 30px;
    margin: 50px auto;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    color: #333;
}
.fortunestick-draw-stick-area h3 {
    color: #a0522d;
}
.fortunestick-stick-container {
    position: relative;
    width: 200px;
    height: 300px;
    margin: 30px auto;
    cursor: pointer;
    transition: transform 0.3s;
}
.fortunestick-stick-container:hover {
    transform: scale(1.05);
}
.fortunestick-stick-image-container {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.fortunestick-stick-draw-btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    background-color: #d2691e;
    color: white;
    padding: 10px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    font-size: 18px;
    font-weight: bold;
}
.fortunestick-drawn-info {
    font-size: 20px;
    color: #a0522d;
    font-weight: bold;
    margin-top: 20px;
}

/* --- 結果顯示框樣式 --- */
.fortunestick-result-modal-overlay {
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
.fortunestick-result-modal {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 15px;
    padding: 40px;
    max-width: 700px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #333;
    animation: modalZoomIn 0.5s forwards;
}
.fortunestick-result-modal h3 {
    color: #a0522d;
    margin-bottom: 30px;
    font-size: 30px;
    border-bottom: 3px solid #d2691e;
    padding-bottom: 10px;
}
.fortunestick-result-display {
    display: flex;
    gap: 30px;
    text-align: left;
    margin-bottom: 30px;
    align-items: flex-start;
}
.fortunestick-result-image {
    width: 40%;
    max-width: 250px;
    height: auto;
    object-fit: contain;
    border: 3px solid #d2691e;
    border-radius: 10px;
}
.fortunestick-result-info {
    flex: 1;
}
.fortunestick-result-info h4 {
    color: #a0522d;
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 10px;
}
.fortunestick-result-info p {
    font-size: 18px;
    line-height: 1.8;
    background: #fff8e6;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #d2691e33;
}

.fortunestick-btn-back {
    display: block;
    width: 280px;
    max-width: 90%;
    margin: 15px auto 0 auto;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
    background-color: #555; 
    color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.fortunestick-btn-back:hover {
    transform: translateY(-2px);
    background-color: #333;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes modalZoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
</style>