<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { ref } from 'vue'; // 👈 Cần thiết cho tính năng thông báo
import axios from 'axios'; // 👈 Cần thiết để fetch thông báo
import store from '../store' 
import { useToast } from 'primevue/usetoast'
import type { User } from '@/types/user' 

const router = useRouter()
const toast = useToast()
// Khởi tạo user bằng computed hoặc ref để đảm bảo phản ứng khi store thay đổi
const user = store.state.user 

// 🌟 THÊM STATE QUẢN LÝ THÔNG BÁO 🌟
const showNotifications = ref(false);
const notifications = ref<any[]>([]); 
const unreadCount = ref(0); 
// ------------------------------------

const onLogout = () => {
  if (user) {
    toast.add({
      severity: 'success',
      summary: `Goodbye, ${user.full_name || user.username}!`,
      detail: `You have successfully logged out.`,
      life: 3000
    })
  }
  
  store.clearUser()
  router.push('/login')
}

// 🌟 LOGIC THÔNG BÁO 🌟
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    if (showNotifications.value && notifications.value.length === 0) {
        fetchNotifications();
    }
};

const fetchNotifications = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        // Gọi API lấy các giao dịch (Ví dụ: /transfers)
        const response = await axios.get('http://localhost:8080/transfers', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Lấy 3 giao dịch đầu tiên và tạo thông báo
        notifications.value = response.data.slice(0, 3).map((t: any) => ({
            id: t.id,
            // Giả lập thông báo dựa trên transfer
            message: t.from_account_id === user?.id 
                     ? `Chuyển ${t.amount} ${t.currency} tới TK #${t.to_account_id}`
                     : `Nhận ${t.amount} ${t.currency} từ TK #${t.from_account_id}`,
            is_new: true // Giả lập trạng thái mới
        }));
        unreadCount.value = notifications.value.filter(n => n.is_new).length; 
        
    } catch (error) {
        console.error("Lỗi tải thông báo:", error);
    }
};
// ------------------------------------
</script>

<template>
  <header class="navbar-header">
    <div class="nav-container">
      <RouterLink to="/profile" class="logo-link">
        <i class="fas fa-university"></i> Simple Bank
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/profile" class="nav-item">
          <i class="fas fa-user-circle"></i> Hồ sơ
        </RouterLink>
        <RouterLink to="/accounts" class="nav-item">
          <i class="fas fa-wallet"></i> Tài khoản
        </RouterLink>
        <RouterLink to="/transfers" class="nav-item">
          <i class="fas fa-exchange-alt"></i> Chuyển khoản
        </RouterLink>
      </nav>

      <div class="user-info">
        
        <div class="notification-area">
          <button @click="toggleNotifications" class="notification-btn">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </button>
          
          <div v-if="showNotifications" class="notification-dropdown">
            <div v-if="notifications.length === 0" class="empty-state">
              Không có thông báo mới.
            </div>
            <div v-for="notif in notifications" :key="notif.id" class="notification-item">
              {{ notif.message }}
            </div>
            <div class="dropdown-footer">Xem tất cả</div>
          </div>
        </div>
        <span v-if="user" class="username-display">Xin chào, {{ user.full_name || user.username }}</span>
        <button @click="onLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-header {
  background-color: #00796b; 
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-link {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: none;
}
.logo-link i {
  margin-right: 8px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #c8e6c9;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: #004d40;
  color: white;
}
.nav-item i {
    margin-right: 5px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.username-display {
    color: white;
    font-weight: 500;
    font-size: 0.9em;
}

.logout-btn {
  background-color: #e57373; 
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* -------------------------------------- */
/* CSS MỚI CHO THÔNG BÁO */
/* -------------------------------------- */

.notification-area {
    position: relative;
    /* Đẩy chuông gần user info */
}

.notification-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.2em;
    cursor: pointer;
    padding: 5px;
    position: relative;
    transition: color 0.2s;
}
.notification-btn:hover {
    color: #e0e0e0;
}

.badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff5722; 
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7em;
    font-weight: bold;
    line-height: 1;
}

.notification-dropdown {
    position: absolute;
    top: 45px; /* Điều chỉnh vị trí thả xuống */
    right: 0;
    width: 300px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow: hidden;
    text-align: left;
}

.notification-item {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 0.95em;
}
.notification-item:last-child {
    border-bottom: none;
}

.empty-state {
    padding: 15px;
    color: #999;
    text-align: center;
}

.dropdown-footer {
    padding: 10px 15px;
    background-color: #f0f0f0;
    text-align: center;
    font-size: 0.85em;
    color: #00796b;
    cursor: pointer;
    font-weight: 600;
}
</style>