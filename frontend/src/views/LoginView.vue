<template>
  <div class="login-page">
    <div class="login-container">
      
      <h1 class="main-title">Simple Bank</h1>
      <p class="subtitle">Đăng nhập để quản lý tài khoản của bạn</p>

      <Toast />
      
      <LoginUser />

      <p class="footer-text">
        Chưa có tài khoản? <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginUser from '@/components/LoginUser.vue'
import Toast from 'primevue/toast'
// Script setup không cần thay đổi gì thêm
</script>

<style scoped>
/* -------------------------------------- */
/* CSS THIẾT KẾ KHUNG VÀ NỀN */
/* -------------------------------------- */

.login-page {
  /* Căn giữa tuyệt đối trên màn hình */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Đảm bảo chiếm toàn bộ chiều cao màn hình */
  background-color: #f0f4f7; /* Màu nền nhẹ nhàng, chuyên nghiệp */
}

.login-container {
  /* KHUNG/CARD CHÍNH */
  width: 380px;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  /* Bóng đổ 3D nhẹ */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); 
  text-align: center;
  transition: transform 0.3s ease;
}

.login-container:hover {
  /* Hiệu ứng nhấc nhẹ khi rê chuột (tùy chọn) */
  transform: translateY(-3px);
}

.main-title {
  /* Tiêu đề "Simple Bank" */
  color: #00796b; /* Màu xanh lá cây thương hiệu */
  font-size: 2.2em;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #555;
  margin-bottom: 30px;
  font-size: 1.05em;
}

.footer-text {
  margin-top: 25px;
  font-size: 0.9em;
  color: #777;
}

.register-link {
  color: #00796b;
  text-decoration: none;
  font-weight: bold;
}
.register-link:hover {
  text-decoration: underline;
}
</style>