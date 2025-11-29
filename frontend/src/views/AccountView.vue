<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import store from '../store';
import { useRouter } from 'vue-router'; 

// Định nghĩa cấu trúc dữ liệu tài khoản
interface Account {
  id: number;
  owner: string;
  balance: number;
  currency: string;
  created_at: string;
}

const router = useRouter();
const accounts = ref<Account[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const defaultPageID = 1;
const defaultPageSize = 10;

const fetchAccounts = async () => {
  isLoading.value = true;
  error.value = null;
  const token = store.state.accessToken; 

  if (!token) {
    error.value = 'Không tìm thấy token. Vui lòng đăng nhập lại.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.get('http://localhost:8080/accounts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { 
        page_id: defaultPageID,
        page_size: defaultPageSize
      }
    });

    accounts.value = response.data;
    
  } catch (err: any) {
    console.error("Lỗi tải tài khoản:", err);
    if (err.response && err.response.status === 401) {
        error.value = 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.';
    } else if (err.response && err.response.status === 400) {
        error.value = 'Lỗi yêu cầu: Frontend không gửi đủ tham số phân trang.';
    } else {
        error.value = 'Lỗi tải dữ liệu tài khoản. Vui lòng kiểm tra Server.';
    }
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        return `${amount} ${currency}`;
    }
};

const goToCreateAccount = () => {
    router.push('/accounts/create'); // Chuyển hướng đến Form Tạo tài khoản
};

onMounted(fetchAccounts);
</script>

<template>
  <div class="account-container">
    <div class="account-card">
      <h2 class="title"><i class="fas fa-wallet icon"></i> Danh sách Tài khoản</h2>
      <hr>

      <div v-if="!isLoading && !error" class="action-bar">
          <button @click="goToCreateAccount" class="btn-primary create-btn">
              <i class="fas fa-plus-circle"></i> Thêm Tài khoản Mới
          </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin loading-spinner"></i>
        <p>Đang tải dữ liệu tài khoản...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">❌ {{ error }}</p>
        <button @click="fetchAccounts" class="btn-primary btn-retry">Thử lại</button>
      </div>

      <div v-else-if="accounts.length === 0" class="empty-state">
        <p>Bạn chưa có tài khoản nào. Vui lòng tạo tài khoản mới.</p>
        <button @click="goToCreateAccount" class="btn-primary">Tạo tài khoản mới</button> 
        <button @click="fetchAccounts" class="btn-secondary">Tải lại</button>
      </div>

      <div v-else class="account-list">
        <div v-for="account in accounts" :key="account.id" class="account-item">
          <div class="details">
            <p class="account-number">Số tài khoản: **{{ account.id }}**</p>
            <p class="owner-name">Chủ sở hữu: **{{ account.owner }}**</p>
            <p class="created-date">Mở tài khoản: {{ new Date(account.created_at).toLocaleDateString() }}</p>
          </div>
          <div class="balance-info">
            <p class="balance-amount">{{ formatCurrency(account.balance, account.currency) }}</p>
            <p class="currency-type">{{ account.currency }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------- */
/* CSS THIẾT KẾ ĐÃ SỬA */
/* -------------------------------------- */
.account-container {
    padding-top: 30px;
    display: flex;
    justify-content: center;
}
.account-card {
    width: 800px;
    max-width: 90%;
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.title {
    color: #00796b;
    font-size: 1.8em;
    font-weight: 700;
    margin-bottom: 10px;
}
.icon {
    margin-right: 10px;
}
hr {
    border: 0;
    border-top: 1px solid #eee;
    margin-bottom: 25px;
}

/* ACTION BAR */
.action-bar {
    display: flex;
    justify-content: flex-end; /* Đẩy nút sang phải */
    margin-bottom: 20px;
}
.create-btn {
    padding: 10px 20px;
    font-size: 1em;
}


/* LIST STYLES */
.account-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
    transition: box-shadow 0.2s;
}
.account-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.details p {
    margin: 4px 0;
    font-size: 0.9em;
}
.account-number {
    font-weight: bold;
    color: #00796b; /* Highlight số tài khoản */
    font-size: 1.1em;
}
.owner-name {
    font-weight: normal;
}


/* BALANCE */
.balance-info {
    text-align: right;
}
.balance-amount {
    font-size: 1.6em;
    font-weight: bold;
    color: #004d40;
    margin-bottom: 0;
}
.currency-type {
    font-size: 0.8em;
    color: #777;
}

/* LOADING/ERROR */
.loading-state, .empty-state {
    text-align: center;
    padding: 30px;
}

/* BUTTONS */
.btn-primary, .btn-secondary, .btn-retry {
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
    margin-right: 10px;
    border: none;
}
.btn-primary {
    background-color: #00796b;
    color: white;
}
.btn-secondary, .btn-retry {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ccc;
}
</style>