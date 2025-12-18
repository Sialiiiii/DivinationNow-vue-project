<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/services/axiosInstance';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const users = ref([]);
const isLoading = ref(true);

// --- 彈窗相關狀態 ---
const showModal = ref(false);
const detailData = ref(null);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        const response = await axiosInstance.get('/admin/users');
        users.value = response.data;
    } catch (error) {
        console.error('獲取列表失敗', error);
    } finally {
        isLoading.value = false;
    }
};

// 💡 點擊「封鎖中」標籤觸發
const fetchBlacklistDetail = async (userId) => {
    try {
        const response = await axiosInstance.get(`/admin/blacklist/detail/${userId}`);
        detailData.value = response.data;
        showModal.value = true;
    } catch (error) {
        alert('無法取得封鎖詳情');
    }
};

const handleToggleBlacklist = async (user) => {
    const action = user.blacklisted ? '解除' : '加入';
    if (!confirm(`確定要將 ${user.username} ${action}黑名單嗎？`)) return;

    try {
        if (user.blacklisted) {
            await axiosInstance.delete(`/admin/blacklist/${user.id}`);
        } else {
            const reason = prompt("請輸入黑名單原因：") || "違反社群守則";
            await axiosInstance.post('/admin/blacklist', { userId: user.id, reason });
        }
        alert(`${action}成功！`);
        fetchUsers();
    } catch (error) {
        alert('操作失敗');
    }
};
</script>

<template>
    <div class="admin-dashboard-container">
        <header class="dashboard-header">
            <div class="header-left">
                <h1>管理儀表板</h1>
                <nav class="admin-tabs">
                    <button @click="router.push('/admin/dashboard')" :class="['tab-btn', { active: route.path === '/admin/dashboard' }]">📝 貼文管理</button>
                    <button @click="router.push('/admin/usermanage')" :class="['tab-btn', { active: route.path === '/admin/usermanage' }]">👥 會員管理</button>
                </nav>
            </div>
            <button @click="router.push('/admin/login')" class="logout-btn">登出系統</button>
        </header>

        <div v-if="isLoading" class="loading-state">載入中...</div>

        <div v-else class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>UID</th>
                        <th>用戶名</th>
                        <th>Email</th>
                        <th>狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" :class="{ 'blacklisted-row': user.blacklisted }">
                        <td>{{ user.id }}</td>
                        <td>{{ user.usernameJPA }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span 
                                :class="user.blacklisted ? 'status-blacklisted clickable' : 'status-clean'"
                                @click="user.blacklisted && fetchBlacklistDetail(user.id)"
                                :title="user.blacklisted ? '點擊查看封鎖原因' : ''"
                            >
                                {{ user.blacklisted ? '🚫 封鎖中 (查看原因)' : '✅ 正常' }}
                            </span>
                        </td>
                        <td>
                            <button @click="handleToggleBlacklist(user)" :class="['action-btn', user.blacklisted ? 'unblock-btn' : 'block-btn']">
                                {{ user.blacklisted ? '解除封鎖' : '封鎖用戶' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content">
                <h3>🚫 封鎖詳細資訊</h3>
                <div class="modal-body" v-if="detailData">
                    <p><strong>被封鎖用戶 ID:</strong> {{ detailData.userId }}</p>
                    <p><strong>封鎖原因:</strong> <span class="reason-text">{{ detailData.reason }}</span></p>
                    <p><strong>執行管理員 ID:</strong> {{ detailData.lockedByAdminId }}</p>
                    <p><strong>封鎖時間:</strong> {{ new Date(detailData.createdAt).toLocaleString() }}</p>
                </div>
                <button class="close-btn" @click="showModal = false">關閉</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-dashboard-container {
    padding: 20px;
    background-color: #f4f7f6;
    min-height: 100vh;
    font-family: 'Microsoft JhengHei', sans-serif;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    border-bottom: 3px solid #36454F;
    padding-bottom: 0;
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
    border-radius: 8px 8px 0 0;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s;
}

.tab-btn.active {
    background-color: #36454F;
    color: white;
}

.logout-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 15px;
}

/* 表格樣式優化 */
.table-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th, .admin-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.admin-table th {
    background-color: #36454F;
    color: white;
}

.status-blacklisted { 
    color: #f44336; 
    font-weight: bold; 
}
.status-clean { 
    color: #4CAF50; 
    font-weight: bold; 
}
.blacklisted-row { 
    background-color: #ffebee; 
}

.action-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-weight: bold;
    transition: all 0.2s ease;
}

.blacklist-btn { 
    background-color: #ff9800; 
}
.unblacklist-btn { 
    background-color: #4CAF50; 
}

.block-btn { 
    background-color: #ff9800; 
}

.block-btn:hover {
    background-color: #e68a00;
    transform: translateY(-1px);
}

.unblock-btn { 
    background-color: #4CAF50; 
}

.unblock-btn:hover {
    background-color: #43a047;
    transform: translateY(-1px);
}

.clickable {
    cursor: pointer;
    text-decoration: underline;
}

.clickable:hover {
    color: #b71c1c;
}

.loading-state, .error-panel {
    text-align: center;
    padding: 50px;
    background: white;
    border-radius: 8px;
}

/* 💡 Modal 彈窗樣式 */
.modal-overlay {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    background: rgba(0,0,0,0.6); 
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background: white; 
    padding: 25px; 
    border-radius: 12px; 
    width: 400px; 
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
}
.modal-body p { 
    margin-bottom: 15px; 
    border-bottom: 1px solid #eee; 
    padding-bottom: 5px; }
.reason-text { 
    color: #d32f2f; 
    font-weight: bold; 
}
.close-btn { 
    width: 100%; 
    padding: 10px; 
    background: #36454F; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    margin-top: 10px; 
}

</style>