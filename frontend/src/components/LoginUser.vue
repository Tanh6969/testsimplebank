<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import store from '@/store' // Đảm bảo đường dẫn tới store là chính xác

// Giả định cấu trúc type User và LoginResponse nằm trong '@/types/user'
interface User {
  full_name: string;
  username: string;
}
interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

const router = useRouter()
const toast = useToast()

const username = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')

const handleLogin = async () => {
  try {
    const response = await axios.post<LoginResponse>(
      'http://localhost:8080/users/login',
      {
        username: username.value,
        password: password.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'none' 
        }
      }
    )

    // 1. Lưu User và Token vào Store và localStorage
    store.setUser(response.data.user, response.data.access_token, response.data.refresh_token)
    
    // 2. Hiển thị thông báo thành công
    toast.add({
      severity: 'success',
      summary: `Hello, ${response.data.user.full_name || response.data.user.username}!`,
      detail: `You have successfully logged in.`,
      life: 3000
    })

    // 3. KHẮC PHỤC: Đặt lệnh chuyển hướng vào setTimeout để tránh xung đột với Toast
    setTimeout(() => {
        router.push('/profile'); // Chuyển đến trang Profile (route con đầu tiên)
    }, 150);
    
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = 'Tên đăng nhập hoặc mật khẩu không đúng.'
    } else {
      errorMessage.value = 'An error occurred. Please try again later.'
    }

    toast.add({
      severity: 'error',
      summary: 'Login failed',
      detail: errorMessage.value,
      life: 3000
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="login-form">
    
    <div class="input-group">
      <i class="fas fa-user icon"></i>
      <input 
        v-model="username" 
        type="text" 
        placeholder="Username" 
        required
        class="input-field"
      />
    </div>

    <div class="input-group">
      <i class="fas fa-lock icon"></i>
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required
        class="input-field"
      />
    </div>

    <button type="submit" class="login-button">
      <i class="fas fa-sign-in-alt"></i> Login
    </button>
  </form>
</template>

<style scoped>
/* -------------------------------------- */
/* CSS LÀM ĐẸP (Giúp form hiển thị ổn định) */
/* -------------------------------------- */

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 15px;
  color: #00796b;
  font-size: 1.1em;
  z-index: 10;
}

.input-field {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.input-field:focus {
  border-color: #00796b;
  box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.2);
}

.login-button {
  width: 100%;
  padding: 15px;
  margin-top: 10px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  letter-spacing: 1px;
}

.login-button i {
    margin-right: 8px;
}

.login-button:hover {
  background-color: #004d40;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>