<script setup>
  import { ref,onMounted } from 'vue';
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // --- 狀態管理 ---
  const showInstruction = ref(true); // 控制是否顯示占卜說明框 (true: 顯示說明, false: 顯示抽卡)

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

  // 卡片資料

  const initialCardData = Array.from({ length: 24 }, (_, i) => {
    const index = i + 1;
    const paddedNumber = String(index).padStart(2, '0');
    return {
      id: index, // 唯一 ID
      front: String(index),
      info: `卡片說明 ${index}`,
      image: `/src/assets/images/RunesCard/CardFront${paddedNumber}.png`,
      isDrawn: false, // 是否被抽出
      isFlipped: false // 是否被翻面
    };
  });

  // 響應式的卡片列表
  const shuffledCards = ref([]);

  // --- 邏輯函數 ---

  /**
     * 切換到抽卡畫面，並執行洗牌/重置
     */
    function startDivination() {
      showInstruction.value = false; // 切換到抽卡畫面
      shuffleAndReset(); // 開始前先洗牌
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
   * @param {Array} array - 要洗牌的陣列
   * @returns {Array} - 洗牌後的陣列
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
   * 計算卡片在 CSS 變數中的索引值 (從 -12 到 11)
   * @param {number} index - 當前卡片的陣列索引
   * @returns {number} - CSS 變數 --i 的值
   */
  const getCardIndex = (index) => {
    return index - Math.floor(initialCardData.length / 2);
  };

  /**
   * 計算卡片的初始 z-index，以確保覆蓋順序正確
   * @param {number} index - 當前卡片的陣列索引
   * @returns {number} - z-index 的值
   */
  const getCardZIndex = (index) => {
    // z-index 應從小到大，使後面的卡片覆蓋前面的卡片
    return index;
  };

  /**
   * 處理卡片點擊事件 (抽牌/翻牌邏輯)
   * @param {object} clickedCard - 被點擊的卡片資料物件
   */
  function handleCardClick(clickedCard) {
    // 檢查是否已經有卡片被翻面 (鎖定狀態)
    const isAnyFlipped = shuffledCards.value.some(card => card.isFlipped);
    if (isAnyFlipped) {
      return;
    }

    if (clickedCard.isDrawn) {
      // 1. 點擊已抽出的卡片 (第二次點擊: 翻面)
      clickedCard.isFlipped = true;
    } else {
      // 2. 點擊新卡片 (換牌/第一次抽取)

      // 將所有卡片收回牌堆狀態 (移除 drawn 和 flipped)
      shuffledCards.value.forEach(card => {
        card.isDrawn = false;
        card.isFlipped = false;
      });

      // 抽出這張新的卡片
      clickedCard.isDrawn = true;
    }
  }

    /**
   * 執行洗牌和重置動作
   */
  function shuffleAndReset() {
    // 將所有卡片狀態重置為初始狀態
    const resetData = initialCardData.map(card => ({
      ...card,
      isDrawn: false,
      isFlipped: false
    }));
    
    // 洗牌並更新響應式狀態
    shuffledCards.value = shuffle(resetData);
  }

  // --- 生命週期鉤子 ---
  onMounted(() => {
    // 初始化：首次載入時洗牌並渲染
    // shuffleAndReset();
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
          <div class="book-actions">
            <a href="#" class="shared-btn-user">會員資料</a>
            <a href="#" class="shared-btn-logout">登出</a> 
          </div>
      </div>
    </header>

  <!-- Main -->
    <main class="runesone-main-content">
      <h1 class="runesone-title-chinese">盧恩符文：單字指引</h1>
      <h2 class="runesone-title-english">One-Rune Pull</h2>

      <!-- 占卜方式說明 -->
      <div v-if="showInstruction" class="runesone-instruction-box">
          <h3>占卜方式說明</h3>
          <p>盧恩符文(Runes)，是北歐眾神之父奧丁（Odin）懸掛於世界樹上所換來的宇宙祕密與強大力量的載體，是一種古老的字母系統。</p>
          <p>本次占卜僅抽取「一顆」符文，直指您當前情境的核心命運建議。</p>
          <p>請在心中默想您的問題或想要專注的主題，準備好後，按下「開始占卜」。</p>
          
          <button class="runesone-start-btn" @click="startDivination">
              開始占卜
          </button>
      </div>

      <!-- 抽卡畫面 -->
      <div v-if="!showInstruction" class="runesone-card-shuffle-app">
        <div class="runesone-container"  @mouseleave="isHovering = false" @mouseenter="isHovering = true">
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
              <div class="runesone-card-face runesone-card-front">
                <img :src="card.image" :alt="`卡片正面 ${card.front}`">
              </div>
            </div>
            <div class="runesone-info-box">{{ card.info }}</div>
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
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s, transform 0.5s;
    pointer-events: none;
    min-width: 300px;
    text-align: center;
    font-size: 1em;
    z-index: 1;
}

/* 翻面後顯示資訊並調整位置 */
.runesone-card-wrapper.drawn.flipped .runesone-info-box {
    opacity: 1;
    --drawn-scale: 1.1; 
    width: calc(var(--card-width) * var(--drawn-scale)); 
    /* height: calc(var(--card-height) * var(--drawn-scale)); */
    transform: translateX(calc(var(--card-width) * var(--drawn-scale) + 5px));
    left: 0;
    top: 0;
    pointer-events: auto;
}



</style>
