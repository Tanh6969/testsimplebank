<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2 class="welcome-text">Welcome to Simple Bank!</h2>

      <div class="user-profile-box">
        <h3>User Profile</h3>
        <div class="info-item">
          <i class="fas fa-user"></i>
          <span class="info-text">{{ user.fullName }}</span>
        </div>
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <span class="info-text">{{ user.email }}</span>
        </div>
      </div>
      
      <hr>

      <nav class="main-nav">
        <router-link to="/accounts" class="nav-link">
          <i class="fas fa-wallet"></i> Xem Tài khoản
        </router-link>
        
        <router-link to="/transfers" class="nav-link">
          <i class="fas fa-exchange-alt"></i> Thực hiện Chuyển khoản
        </router-link>
      </nav>
      
      <hr>

      <button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Giả định bạn đã có một hàm hoặc service để giải mã token để lấy thông tin user
// Nếu không có, bạn cần thay thế logic này bằng cách lấy thông tin user từ store/state
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  fullName: string;
  email: string;
}

export default defineComponent({
  name: 'ProfileView',
  setup() {
    const router = useRouter();
    const user = reactive<User>({
      username: '',
      fullName: 'Đang tải...',
      email: '',
    });

    onMounted(() => {
      // 🌟 Lấy thông tin user từ Token (Giả định token là JWT)
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          // Thông tin user sau khi đăng nhập thành công nằm trong payload của JWT
          // Cấu trúc payload có thể khác nhau tùy thuộc vào backend của bạn.
          user.username = decoded.username || 'N/A';
          user.fullName = decoded.full_name || decoded.username || 'Tên người dùng';
          user.email = decoded.email || 'N/A';
        } catch (e) {
          console.error("Lỗi giải mã token:", e);
          // Nếu token lỗi, chuyển về trang login
          router.push('/login');
        }
      } else {
        // Nếu không có token, chuyển về trang login (cũng được xử lý bởi navigation guard)
        router.push('/login');
      }
    });

    const logout = () => {
      // Xóa token và chuyển hướng về trang đăng nhập
      localStorage.removeItem('access_token');
      // Tùy chọn: Xóa thông tin user khỏi store/state nếu có
      router.push('/login');
    };

    return {
      user,
      logout,
    };
  },
});
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.profile-card {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.welcome-text {
  color: #00796b;
  margin-bottom: 25px;
  font-size: 1.8em;
}
.user-profile-box {
  text-align: left;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
}
.user-profile-box h3 {
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.2em;
}
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #555;
}
.info-item i {
  margin-right: 10px;
  color: #00796b;
  width: 20px;
  text-align: center;
}
.main-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  text-align: left;
}
.nav-link {
  text-decoration: none;
  padding: 12px 15px;
  background-color: #f0fff0; /* Light green background */
  border: 1px solid #00796b;
  border-radius: 6px;
  color: #00796b;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s;
}
.nav-link:hover {
  background-color: #00796b;
  color: white;
}
.nav-link i {
  margin-right: 8px;
}
.logout-button {
  width: 100%;
  padding: 12px;
  background-color: #dc3545; /* Red color for logout */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s;
}
.logout-button:hover {
  background-color: #c82333;
}
.logout-button i {
    margin-right: 5px;
}
</style>