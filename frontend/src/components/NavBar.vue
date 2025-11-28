<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import store from '../store' // Giả định store vẫn ở ../store
import { useToast } from 'primevue/usetoast'
import type { User } from '@/types/user' // Giả định type User

const router = useRouter()
const toast = useToast()
const user = store.state.user // Lấy user hiện tại từ store

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
  background-color: #00796b; /* Màu xanh thương hiệu */
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
  color: #c8e6c9; /* Màu sáng */
  text-decoration: none;
  font-weight: 500;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  background-color: #004d40; /* Màu đậm hơn khi hover/active */
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
  background-color: #e57373; /* Màu đỏ nhẹ */
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
</style>