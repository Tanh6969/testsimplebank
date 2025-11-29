<script setup lang="ts">
import NavBar from '@/components/NavBar.vue' // Sẽ tạo ở Bước 2
import Toast from 'primevue/toast'
// Các logic store/toast/router vẫn giữ nguyên nếu bạn cần
</script>

<template>
  <div class="main-layout">
    <Toast />
    
    <NavBar />

    <div class="content-area">
      <router-view></router-view> 
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  background-color: #f8f9fa; /* Màu nền nhẹ */
}
.content-area {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
