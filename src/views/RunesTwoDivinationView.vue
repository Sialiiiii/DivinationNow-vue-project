<script setup>
import { ref,onMounted, computed } from 'vue'; // 導入 computed
import { useRouter } from 'vue-router'

const router = useRouter()

if (!router) {
  console.error('Router is not available!')
}

// --- 狀態管理 ---
  const showInstruction = ref(true); // 控制是否顯示占卜說明框 (true: 顯示說明, false: 顯示抽卡)
  const isMenuOpen = ref(false); // 漢堡選單
  const drawnCards = ref([]); // 追蹤已抽取的卡片物件 (最多兩個)
  const showResultModal = ref(false); // 控制是否顯示結果說明框

// 計算屬性：檢查是否已抽出兩張牌
  const hasDrawnTwoCards = computed(() => drawnCards.value.length === 2);


// --- 漢堡選單  ---
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

// --- 漢堡選單導航方法  ---
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

// ** 修改: 完整的 37 張卡片資料 **
const fullCardDeck = Array.from({ length: 37 }, (_, i) => {
  const index = i + 1;
  const paddedNumber = String(index).padStart(2, '0');
  return {
    id: index, // 唯一 ID
    front: String(index),
    info: `卡片說明 ${index}`,
    image: `/src/assets/images/RunesCardUprightReversed/CardFront${paddedNumber}.png`,
    isDrawn: false, // 是否被抽出
    isFlipped: false // 是否被翻面
  };
});

// 響應式的卡片列表 (用於顯示的 24 張)
const shuffledCards = ref([]);

// --- 邏輯函數 ---

  /**
   * 切換到抽卡畫面，並執行洗牌/重置
   */
    function startDivination() {
      showInstruction.value = false; // 切換到抽卡畫面
      shuffleAndReset(); // 開始前先洗牌 (現在包含選取 24 張的邏輯)
    }

  /**
   * 重置回說明畫面
   */
    function resetToInstruction() {
    // 顯示說明畫面
      showInstruction.value = true;
    // 清空卡片狀態 (讓卡片收回牌堆)
      shuffleAndReset();
    }

  /**
  * Fisher-Yates 洗牌算法
  */
    function shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

  /**
   * ** 新增: 從完整牌組中隨機選取 N 張卡片 **
   * @param {Array} array - 完整的卡片陣列 (37張)
   * @param {number} count - 要選取的數量 (24張)
   * @returns {Array} 隨機選出的卡片陣列 (24張)
   */
  function selectRandomCards(array, count) {
    const deck = [...array];
    // 執行 Fisher-Yates 洗牌 (確保隨機性)
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // 選取前 count 張卡片
    return deck.slice(0, count);
  }

  /**
  * 計算卡片在 CSS 變數中的索引值
  */
    const getCardIndex = (index) => {
    // 總數使用當前牌堆的長度 (即 24)
    return index - Math.floor(shuffledCards.value.length / 2);
  };

  /**
  * 計算卡片的初始 z-index
  */
    const getCardZIndex = (index) => {
    // z-index 應從小到大，使後面的卡片覆蓋前面的卡片
    return index;
  };

  /**
  * 處理卡片點擊事件 (抽牌/翻牌邏輯) **
  * @param {object} clickedCard - 被點擊的卡片資料物件
  */
    function handleCardClick(clickedCard) {
      // 1. 如果已經抽滿兩張，則不允許再點擊
      if (hasDrawnTwoCards.value) {
        return;
      }

      // 2. 如果卡片已經被抽取 (防止重複抽取同一張)
      if (clickedCard.isDrawn) {
        return; 
      }

      // 3. 抽取新卡片
      clickedCard.isDrawn = true;
      clickedCard.isFlipped = true; // 抽取時立即翻開

      // 4. 將卡片加入已抽取列表
      drawnCards.value.push(clickedCard);

      // 5. 檢查是否抽滿兩張
      if (drawnCards.value.length === 2) {
      // 抽滿兩張後，等待動畫完成（約 1.5 秒）後顯示結果框
      setTimeout(() => {
        showResultModal.value = true;
      }, 1500); // 這裡的時間應與 CSS 的 transition 時間匹配或更長
      }
    }

  /**
  * 執行洗牌和重置動作 **
  */
    function shuffleAndReset() {
      // 1. 從完整的 37 張牌組中，隨機選取 24 張
      const selected24Cards = selectRandomCards(fullCardDeck, 24);

      // 2. 將選出的 24 張卡片狀態重置為初始狀態
      const resetData = selected24Cards.map(card => ({
        ...card,
        isDrawn: false,
        isFlipped: false
      }));

      // 3. 重置抽牌狀態和結果顯示
      drawnCards.value = [];
      showResultModal.value = false;

      // 4. 將這 24 張卡片洗牌並更新響應式狀態
      shuffledCards.value = shuffle(resetData);
    }

  // --- 結果框關閉/重新開始方法 ---
    function closeResultModal() {
      showResultModal.value = false;
      shuffleAndReset(); // 關閉結果框後重置牌堆
    }

// --- 生命週期鉤子 (保持不變) ---
    onMounted(() => {
      // 初始化：首次載入時洗牌並渲染
      shuffleAndReset();
    });

</script>

<template>
  <video autoplay muted loop id="runestwo-background-video">
    <source src="/src/assets/videos/BackgroundV04.mp4" type="video/mp4">
  </video>
  
  <div class="runestwo-page-container">
    <!-- 漢堡選單(shared.css) -->
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
  


    <!-- Header(shared.css)-->
    <header class="shared-header">
      <div class="header-top">
        <div class="shared-logo">DIVINATION.NOW</div>
      </div>
      
      <div class="shared-header-divider"></div>
      
      <div class="shared-header-bottom">
        <button @click="toggleMenu" class="shared-menu-icon">&#9776;</button>
          <div class="book-actions">
            <a href="#" class="shared-btn-user">會員資料</a>
            <a href="#" class="shared-btn-logout">登出</a> 
          </div>
      </div>
    </header>

    <!-- Main -->
    <main class="runestwo-main-content">
      <h1 class="runestwo-title-chinese">盧恩符文：雙字指引</h1>
      <h2 class="runestwo-title-english">Two-Rune Pull</h2>

      <!-- 占卜方式說明 -->
      <div v-if="showInstruction" class="runestwo-instruction-box">
          <h3>占卜方式說明</h3>
          <p>盧恩符文(Runes)，是北歐眾神之父奧丁（Odin）懸掛於世界樹上所換來的宇宙祕密與強大力量的載體，是一種古老的字母系統。</p>
          <p>本次占卜僅抽取「兩顆」符文，直指您當前情境的核心命運建議。</p>
          <p>請在心中默想您的問題或想要專注的主題，準備好後，按下「開始占卜」。</p>
          
          <button class="runestwo-start-btn" @click="startDivination">
              開始占卜
          </button>
      </div>

      <!-- 抽卡畫面 -->
      <div v-if="!showInstruction" class="runestwo-card-shuffle-app">
        <div class="runestwo-container" 
          @mouseleave="isHovering = false"
          @mouseenter="isHovering = true">
          <div v-for="(card, index) in shuffledCards" 
            :key="card.id" class="runestwo-card-wrapper"
            :class="{ 
              'drawn': card.isDrawn, 
              'flipped': card.isFlipped,
              // 根據在 drawnCards 中的索引來決定顯示位置
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

    <div v-if="!showInstruction && !showResultModal" class="runestwo-action-buttons">
      <button class="runestwo-shuffle-btn" @click="shuffleAndReset">
        洗牌
      </button>

      <button @click="resetToInstruction" class="runestwo-btn-back">
        回到占卜方式說明
      </button>
    </div>

    <div v-if="showResultModal" class="runestwo-result-modal-overlay">
      <div class="runestwo-result-modal">
        <h3>🔮 盧恩符文占卜結果 🔮</h3>
        <div class="runestwo-result-cards-display">
          <div class="runestwo-result-card-item">
            <h4>第一張牌 (現況/基礎)</h4>
            <img :src="drawnCards[0].image" alt="第一張牌" class="runestwo-result-card-image">
            <p class="runestwo-result-card-info">{{ drawnCards[0].info }}</p>
          </div>
          <div class="runestwo-result-card-item">
            <h4>第二張牌 (建議/指引)</h4>
            <img :src="drawnCards[1].image" alt="第二張牌" class="runestwo-result-card-image">
            <p class="runestwo-result-card-info">{{ drawnCards[1].info }}</p>
          </div>
        </div>

        <p class="runestwo-result-summary">綜觀兩張牌的指引，請仔細思考它們對您問題的啟示。</p>
        
        <button class="runestwo-start-btn" @click="closeResultModal">
          重新開始占卜
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

#runestwo-background-video {
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

.runestwo-page-container {
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
    transform: translate(0, -20px) scale(1.3) !important; /* 縮小抽出的位移和縮放 */
    z-index: 1000 !important;
    /* transition: all 0.5s ease-in-out;  */
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 第一張抽出的卡片：移動到左邊 */
.runestwo-card-wrapper.drawn.drawn-left {
  /* transform: translate(-100px, -20px) scale(1.3) !important; */
  transform: translate(-450px, -220px) scale(0.7) !important;
}

/* 第二張抽出的卡片：移動到右邊 */
.runestwo-card-wrapper.drawn.drawn-right {
  /* transform: translate(100px, -20px) scale(1.3) !important; */
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
  padding: 40px;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #333;
  transform: scale(0.8);
  animation: modalZoomIn 0.5s forwards;
}

.runestwo-result-modal h3 {
  color: #2a3a5e;
  margin-bottom: 30px;
  font-size: 28px;
}

.runestwo-result-cards-display {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 30px;
}

.runestwo-result-card-item {
  flex: 1;
  max-width: 300px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.runestwo-result-card-item h4 {
  color: #555;
  margin-top: 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  font-size: 18px;
}

.runestwo-result-card-image {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #eee;
}

.runestwo-result-card-info {
  font-size: 16px;
  line-height: 1.6;
  text-align: left;
  color: #222;
  min-height: 100px; /* 確保內容框有一定高度 */
}

.runestwo-result-summary {
  font-size: 18px;
  color: #010305;
  font-weight: 500;
  margin-bottom: 30px;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalZoomIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>