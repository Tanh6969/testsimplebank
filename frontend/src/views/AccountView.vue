<template>
  <div class="container">
    <h2>💰 Danh sách Tài khoản</h2>
    <p class="loading-state" v-if="isLoading">Đang tải dữ liệu tài khoản...</p>
    
    <div v-else-if="accounts.length === 0">
      <p>Bạn chưa có tài khoản nào. Vui lòng tạo tài khoản mới.</p>
    </div>
    
    <ul v-else class="account-list">
      <li v-for="account in accounts" :key="account.id" class="account-item">
        <h3>{{ account.owner }} - #{{ account.id }}</h3>
        <p>Số dư: <strong>{{ formatCurrency(account.balance, account.currency) }}</strong></p>
        <p>Tiền tệ: {{ account.currency }}</p>
      </li>
    </ul>

    <button @click="fetchAccounts" class="refresh-button">Tải lại</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios'; // Giả sử bạn đang dùng axios

interface Account {
  id: number;
  owner: string;
  balance: number;
  currency: string;
}

export default defineComponent({
  name: 'AccountView',
  setup() {
    const accounts = ref<Account[]>([]);
    const isLoading = ref(true);
    const error = ref<string | null>(null);

    const fetchAccounts = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        // Lấy token đã lưu sau khi đăng nhập thành công
        const token = localStorage.getItem('access_token'); 
        
        const response = await axios.get('http://localhost:8080/accounts', {
          headers: {
            // 🌟 CỰC KỲ QUAN TRỌNG: Gửi Bearer Token để xác thực
            Authorization: `Bearer ${token}`, 
          },
        });
        
        accounts.value = response.data; // Giả sử API trả về mảng tài khoản
      } catch (err) {
        // Xử lý lỗi (ví dụ: token hết hạn, server lỗi 500)
        error.value = 'Không thể tải tài khoản. Vui lòng kiểm tra đăng nhập.';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Hàm định dạng tiền tệ đơn giản
    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    };

    // Tải dữ liệu khi component được mount
    onMounted(fetchAccounts);

    return {
      accounts,
      isLoading,
      error,
      fetchAccounts,
      formatCurrency,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h2 {
  color: #00796b;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.account-list {
  list-style: none;
  padding: 0;
}
.account-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #f9f9f9;
}
.refresh-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>