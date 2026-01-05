<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const authStore = useAuthStore();
const posts = ref([]); 
const newPostContent = ref('');
const isLoading = ref(true);
const isRulesExpanded = ref(false);
const toggleRules = () => {
    isRulesExpanded.value = !isRulesExpanded.value;
};


 // --- 漢堡選單 ---
  const isMenuOpen = ref(false); 

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  // --- 漢堡選單導航  ---
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



// 儲存當前用戶對每個貼文的 reactionType
// Key: postId, Value: reactionType ("LOVE", "EMOTION", "FUNNY")
const userReactions = reactive({});
const reactions = [
  { type: 'LOVE', emoji: '💖' },
  { type: 'EMOTION', emoji: '🥹' },
  { type: 'FUNNY', emoji: '🤣' },
];

onMounted(() => {
  fetchPosts();
});

// --- API 呼叫方法 ---

/**
 * 獲取貼文列表
 */
const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/posts');
    
    Object.keys(userReactions).forEach(key => delete userReactions[key]);

    posts.value = response.data.map(post => {
        if (post.userReactionType) {
            userReactions[post.postId] = post.userReactionType;
        }
        return post;
    });
  } catch (error) {
    console.error('載入貼文失敗:', error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * 處理發布新貼文
 */
const submitPost = async () => {
  const content = newPostContent.value.trim();
  if (!content) return alert('內容不能為空喔！');
  if (!authStore.isAuthenticated) return alert('請先登入才能發布貼文喔！');

  try {
    await axios.post('/api/posts', { content });
    alert('貼文發布成功！');
    newPostContent.value = '';
    await fetchPosts(); 
  } catch (error) {
    const message = error.response?.data?.message || '發布失敗，請檢查網路或是否被鎖定。';
    alert(`貼文發布失敗: ${message}`);
  }
};

/**
 * 處理點擊表情符號
 */
const handleReaction = async (post, reactionType) => {
  if (!authStore.isAuthenticated) return alert('請先登入才能按表情符號喔！');
  
  const postId = post.postId;
  const currentReaction = userReactions[postId];
  
  try {
    const response = await axios.patch(`/api/posts/${postId}/reaction`, { reactionType });
    const newCounts = response.data;
    
    // 更新貼文計數
    post.loveCount = newCounts.loveCount;
    post.emotionCount = newCounts.emotionCount;
    post.funnyCount = newCounts.funnyCount;
    
    // 更新用戶點讚狀態
    if (currentReaction === reactionType) {
      // 點擊相同的表情符號 -> 取消讚
      delete userReactions[postId];
    } else {
      // 點擊新讚或換讚
      userReactions[postId] = reactionType;
    }

  } catch (error) {
    console.error('表情符號操作失敗:', error);
    alert('操作失敗，請稍後再試。');
  }
};

// 格式化日期
const formatTime = (isoTime) => {
  if (!isoTime) return '未知時間';
  const date = new Date(isoTime);
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
         + ' ' + date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
<video autoplay muted loop id="sanctuary-background-video">
        <source src="/src/assets/videos/BackgroundV14.mp4" type="video/mp4">
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
        <li><button @click="goBookOfAnswers">解答之書</button></li>
        <li><button @click="goRunesOne">盧恩符文 (單指引)</button></li>
        <li><button @click="goRunesTwo">盧恩符文 (雙指引)</button></li>
        <li><button @click="goFortuneStickOne">六十甲子籤</button></li>
        <li><button @click="goFortuneStickTwo">雷雨師百籤</button></li>
        <li><button @click="goSanctuary" class="is-current">心靈樹洞</button></li>
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
  <div class="sanctuary-container">
    <header class="sanctuary-header">
      <h1 class="main-title">心靈樹洞</h1>
    </header>

    <section class="rules-section">
        <div class="rules-header" @click="toggleRules">
            <h3>樹洞使用須知與心靈公約</h3>
            <span class="toggle-icon">{{ isRulesExpanded ? '▲ 隱藏公約' : '▼ 展開公約' }}</span>
        </div>

        <div v-if="isRulesExpanded" class="rules-content">
            <h4>一、 留言內容規範</h4>
            <ul>
                <li>▪️ 保持匿名與隱私：這裡是一個可以安心卸下偽裝的地方。請不要留下任何足以辨識你或其他人的真實姓名、電話、地址或其他個人聯繫資訊。</li>
                <li>▪️ 互相尊重與友善：嚴禁任何形式的人身攻擊、歧視、謾罵或針對特定群體的仇恨言論。</li>
                <li>▪️ 避免法律與危險內容：請勿張貼任何涉及違法行為、犯罪資訊，或鼓勵自殘/傷害他人的內容。若您或您的朋友正處於危險之中，請立即尋求專業協助。</li>
                <li>▪️ 謝絕商業宣傳：本樹洞不開放任何廣告、商業推銷或募款相關資訊。</li>
            </ul>
            <h4>二、 留言板精神</h4>
            <ul>
                <li>▪️ 專注傾聽與表達：這裡的主要目的是提供一個「說」與「聽」的空間。你可以自由地表達你的情緒、困惑或感受，無須擔心被評判。</li>
                <li>▪️ 允許不完美：你的感受都是真實且有效的。這裡鼓勵你展現真實的自己，即使是不完美、傷心或憤怒的時刻。</li>
            </ul>
            <h4>三、 違規與處置</h4>
            <ul>
                <li>▪️ 違規處置原則： 針對任何違反上述公約的留言，管理員將會進行審核並移除。</li>
                <li>▪️ 黑名單機制： 針對嚴重違規行為或持續違反公約的使用者，我們會將其帳號列入黑名單，以保護其他使用者擁有一個安全的心靈空間。</li>
            </ul>

            <p class="special-note">
                🚨 特別提醒：心靈樹洞僅作為一個心情抒發的平台，無法取代專業的心理諮詢或醫療協助。如果您有緊急的心理困擾，請立即撥打當地的生命線或尋求專業機構的幫助。
            </p>
        </div>
    </section>

    <section class="post-form-section">
      <div v-if="authStore.isAuthenticated" class="post-input-area">
        <textarea 
          v-model="newPostContent" 
          placeholder="輸入你想抒發的心情文字 (最多500字)..."
          maxlength="500"
        ></textarea>
        <button @click="submitPost" :disabled="!newPostContent.trim()">
          {{ newPostContent.trim() ? '對樹洞喊話' : '請輸入內容' }}
        </button>
      </div>
      <div v-else class="login-prompt">
        <p>💡 **登入後即可發布您的心境貼文。**</p>
      </div>
    </section>

    <section class="posts-list-section">
      <h2>最新分享</h2>
      <div v-if="isLoading" class="loading-state">
        <p>載入中... 請稍候。</p>
      </div>
      <div v-else-if="posts.length === 0" class="no-posts">
        <p>目前還沒有任何貼文喔，快來發布第一篇吧！</p>
      </div>
      
      <div v-else class="posts-grid">
        <div v-for="post in posts" :key="post.postId" class="post-card">
          
          <p class="post-content">{{ post.content }}</p>

          <div class="post-meta">
            <span class="post-user">🫧 {{ post.username }}</span>
            <span class="post-date">{{ formatTime(post.createdAt) }}</span>
          </div>

          <div class="post-reactions">
            <span v-for="reaction in reactions" :key="reaction.type" 
                  @click="handleReaction(post, reaction.type)"
                  :class="['reaction-btn', { 'active': userReactions[post.postId] === reaction.type }]"
            >
              {{ reaction.emoji }} {{ post[`${reaction.type.toLowerCase()}Count`] }}
            </span>
            <span v-if="post.isPostOwnedByCurrentUser" class="post-owned"> (您的貼文)</span>
          </div>
        </div>
      </div>
    </section>
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
      overflow-x: hidden;
  }

  /* 背景影片樣式 */
  #sanctuary-background-video {
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

/* 頁面容器 */
.sanctuary-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
}

.sanctuary-header {
  text-align: center;
  margin-bottom: 10px;
  margin-top: -50px;
}

.main-title {
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 10px;
}

/* -------------------- 版規區塊樣式 -------------------- */
.rules-section {
    max-width: 900px;
    margin: 0 auto 40px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(2px);
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.rules-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 25px;
    background-color: #335d94;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.rules-header:hover {
    background-color: #2a4c77;
}

.rules-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.toggle-icon {
    font-size: 0.9rem;
    font-weight: bold;
    margin-left: 15px;
    color: #ffcc80;
}

.rules-content {
    padding: 25px;
    line-height: 1.7;
    text-align: left;
    color: #333;
    animation: fadeIn 0.4s ease-out;
}

.rules-content h4 {
    color: #007bff;
    margin-top: 20px;
    margin-bottom: 8px;
    padding-bottom: 3px;
    border-bottom: 2px solid #eee;
    font-size: 1.1rem;
}

.rules-content ul {
    list-style: none;
    padding-left: 0;
    margin-top: 0;
}

.rules-content li {
    margin-bottom: 10px;
    padding-left: 1.5em; 
    text-indent: -1.5em; 
}

.special-note {
    margin-top: 30px;
    padding: 15px;
    border: 1px solid #ff7e00;
    background-color: #fff8e1;
    border-radius: 5px;
    font-weight: bold;
    color: #c05200;
}


/* 發布區塊樣式 */
.post-form-section {
    background-color: #f0f8ff;
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.post-input-area {
    display: flex;
    flex-direction: column;
}

.post-input-area textarea {
    min-height: 120px;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #a3ccff;
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
}

.post-input-area button {
    background-color: #007bff;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s;
}

.post-input-area button:hover:not(:disabled) {
    background-color: #0056b3;
}
.post-input-area button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.login-prompt {
    text-align: center;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    color: #333;
}

/* 貼文列表樣式 */
.posts-list-section h2 {
    font-size: 1.8rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 25px;
    color: #333;
}

.loading-state, .no-posts {
    text-align: center;
    padding: 50px;
    color: #888;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.post-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #a3ccff; 
  display: flex;
  flex-direction: column;
}

.post-content {
  flex-grow: 1;
  margin-bottom: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #333;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-top: auto; 
  margin-bottom: 10px;
  padding-top: 5px;
  border-top: 1px dashed #eee;
  font-size: 0.9rem;
}

.post-user {
  font-weight: bold;
  color: #335d94;
}

.post-date {
  color: #999;
}

/* 互動區塊樣式 */
.post-reactions {
    display: flex;
    gap: 15px;
    padding-top: 10px;
    border-top: 1px solid #eee;
    flex-wrap: wrap;
}

.reaction-btn {
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 20px;
    background-color: #f0f0f0;
    font-size: 0.9rem;
    transition: background-color 0.2s, transform 0.1s;
    user-select: none;
    line-height: 1.2;
}

.reaction-btn:hover {
    background-color: #e0e0e0;
}

.reaction-btn.active {
    background-color: #a3ccff;
    color: #1a1a2e;
    font-weight: bold;
    transform: scale(1.05);
}
.post-owned {
    margin-left: auto;
    color: #007bff;
    font-size: 0.85rem;
    line-height: 25px; 
}


/* RWD 調整 */
@media (max-width: 768px) {
    .rules-header {
        padding: 12px 18px;
    }
    .rules-header h3 {
        font-size: 1.1rem;
    }
    .rules-content {
        padding: 18px;
    }
}

/* 簡單的淡入動畫 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>