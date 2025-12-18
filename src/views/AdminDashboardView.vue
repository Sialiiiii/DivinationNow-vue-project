<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/services/axiosInstance'; 
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); 
const posts = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

onMounted(() => {
  fetchAdminPosts();
});

const fetchAdminPosts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axiosInstance.get('/admin/posts');
    posts.value = response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        errorMessage.value = '權限不足或登入失效，請重新登入。';
        router.push('/admin/login');
    } else {
        errorMessage.value = '載入貼文失敗。請檢查伺服器連線。';
    }
    console.error('Fetch Admin Posts Failed:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDeletePost = async (postId) => {
    if (!confirm(`確定要刪除 Post ID: ${postId} 嗎？此操作不可逆！`)) return;
    try {
        await axiosInstance.delete(`/admin/posts/${postId}`);
        alert('貼文刪除成功！');
        posts.value = posts.value.filter(post => post.postId !== postId);
    } catch (error) {
        alert('刪除失敗。');
    }
};

const handleToggleBlacklist = async (post) => {
    const userId = post.userId;
    const isCurrentlyBlacklisted = post.blacklisted; 
    
    if (isCurrentlyBlacklisted) {
        if (!confirm(`確定要將用戶 ID: ${userId} 從黑名單中移除嗎？`)) return;
        try {
            await axiosInstance.delete(`/admin/blacklist/${userId}`);
            alert('用戶已解除黑名單！');
            posts.value.forEach(p => {
                if (p.userId === userId) p.blacklisted = false;
            });
        } catch (error) {
            alert('操作失敗。');
        }
    } else {
        const reason = prompt(`確定要將用戶 ID: ${userId} 加入黑名單嗎？請輸入原因：`);
        if (!reason) return;
        try {
            await axiosInstance.post('/admin/blacklist', { userId, reason });
            alert('用戶已加入黑名單！');
            posts.value.forEach(p => {
                if (p.userId === userId) p.blacklisted = true;
            });
        } catch (error) {
            alert('加入黑名單失敗。');
        }
    }
};

const formatTime = (isoTime) => {
  if (!isoTime) return '未知時間';
  const date = new Date(isoTime);
  return date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="admin-dashboard-container">
    <header class="dashboard-header">
      <div class="header-left">
        <h1>管理儀表板</h1>
        <nav class="admin-tabs">
          <button 
            @click="router.push('/admin/dashboard')" 
            :class="['tab-btn', { active: route.path === '/admin/dashboard' }]"
          >
            📝 貼文管理
          </button>
          <button 
            @click="router.push('/admin/usermanage')" 
            :class="['tab-btn', { active: route.path === '/admin/usermanage' }]"
          >
            👥 會員管理
          </button>
        </nav>
      </div>
      <button @click="router.push('/admin/login')" class="logout-btn">登出系統</button>
    </header>

    <div v-if="errorMessage" class="error-panel">{{ errorMessage }}</div>

    <div v-if="isLoading" class="loading-state">
      <p>正在載入資料，請稍候...</p>
    </div>

    <div v-else class="posts-table-wrapper">
      <table class="posts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶 ID</th>
            <th>暱稱</th>
            <th>貼文內容</th>
            <th>心情數</th>
            <th>發布時間</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.postId" :class="{ 'blacklisted-row': post.blacklisted }">
            <td>{{ post.postId }}</td>
            <td>{{ post.userId }}</td>
            <td>{{ post.username }}</td>
            <td class="content-cell">{{ post.content }}</td>
            <td>💖{{ post.loveCount }} / 🥹{{ post.emotionCount }} / 🤣{{ post.funnyCount }}</td>
            <td>{{ formatTime(post.createdAt) }}</td>
            <td :class="post.blacklisted ? 'status-blacklisted' : 'status-clean'">
              {{ post.blacklisted ? '🔒 已黑名單' : '✅ 正常' }}
            </td>
            <td class="action-cell">
              <button @click="handleDeletePost(post.postId)" class="action-btn delete-btn">刪除</button>
              <button @click="handleToggleBlacklist(post)" 
                      :class="['action-btn', post.blacklisted ? 'unblacklist-btn' : 'blacklist-btn']">
                {{ post.blacklisted ? '解除黑名單' : '加入黑名單' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 基礎設定 */
.admin-dashboard-container {
  padding: 20px;
  background-color: #f4f7f6;
  min-height: 100vh;
  font-family: 'Microsoft JhengHei', sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 對齊底端讓標籤貼合分隔線 */
  margin-bottom: 30px;
  border-bottom: 3px solid #36454F;
  padding-bottom: 0; /* 讓 Tabs 貼在線上面 */
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #36454F;
  margin: 0;
}

/* 💡 導航標籤樣式 */
.admin-tabs {
  display: flex;
  gap: 5px;
}

.tab-btn {
  padding: 10px 25px;
  border: none;
  background-color: #e0e0e0;
  color: #666;
  cursor: pointer;
  border-radius: 8px 8px 0 0; /* 上圓角 */
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s;
}

.tab-btn:hover {
  background-color: #d0d0d0;
}

.tab-btn.active {
  background-color: #36454F;
  color: white;
}

/* 登出按鈕 - 稍微往上調一點點免得被擋住 */
.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* ... 以下維持原本的 CSS 不變 ... */
.loading-state, .error-panel {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #555;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 30px;
}
.error-panel { 
  color: #f44336; 
  border: 1px solid #f44336; 
}
.posts-table-wrapper { 
  overflow-x: auto; 
  background-color: white; 
  border-radius: 8px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
}
.posts-table { 
  width: 100%; 
  border-collapse: 
  collapse; 
}
.posts-table th, .posts-table td { 
  padding: 12px 15px; 
  text-align: left; 
  border-bottom: 1px solid #ddd; 
  font-size: 0.95rem; 
}
.posts-table th { 
  background-color: #36454F; 
  color: white; 
  font-weight: 600; 
  white-space: nowrap; 
}
.posts-table tr:hover:not(.blacklisted-row) { 
  background-color: #f0f8ff; 
}
.content-cell { 
  max-width: 400px; 
  white-space: normal; 
  word-wrap: break-word; 
}
.status-blacklisted { 
  font-weight: bold; 
  color: #f44336; 
}
.status-clean { 
  color: #4CAF50; 
}
.blacklisted-row { 
  background-color: #ffebee; 
  color: #9e9e9e; 
}
.blacklisted-row td { 
  border-color: #f8c8c8; 
}
.action-cell { 
  white-space: nowrap; 
}
.action-btn { 
  padding: 8px 12px; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  font-size: 0.85rem; 
  margin-right: 5px; 
  transition: opacity 0.3s; 
}
.action-btn:hover { 
  opacity: 0.8; 
}
.delete-btn { 
  background-color: #f44336; 
  color: white; 
}
.blacklist-btn { 
  background-color: #ff9800; 
  color: white; 
}
.unblacklist-btn { 
  background-color: #4CAF50; 
  color: white; 
  }
</style>