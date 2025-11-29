<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import store from '@/store';

const router = useRouter();
const toast = useToast();

const currency = ref('USD'); // Giá trị mặc định
const isSubmitting = ref(false);
const availableCurrencies = ['USD', 'EUR', 'VND', 'CAD']; // Các loại tiền tệ hỗ trợ

const handleSubmit = async () => {
    isSubmitting.value = true;
    const token = store.state.accessToken;

    if (!token) {
        toast.add({severity: 'error', summary: 'Lỗi', detail: 'Vui lòng đăng nhập lại.', life: 3000});
        isSubmitting.value = false;
        return;
    }

    try {
        // GỌI API POST /accounts
        await axios.post('http://localhost:8080/accounts', {
            currency: currency.value
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        toast.add({
            severity: 'success',
            summary: 'Thành công',
            detail: `Tài khoản ${currency.value} đã được tạo thành công!`,
            life: 3000
        });

        // Chuyển hướng về trang danh sách tài khoản
        setTimeout(() => {
            router.push('/accounts'); 
        }, 150);

    } catch (err: any) {
        console.error("Lỗi tạo tài khoản:", err);
        const errorDetail = err.response?.data?.error || 'Lỗi không xác định.';

        toast.add({
            severity: 'error',
            summary: 'Lỗi Tạo Tài khoản',
            detail: errorDetail,
            life: 5000
        });
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <div class="create-account-container">
    <div class="create-account-card">
      <h2 class="title"><i class="fas fa-plus-circle icon"></i> Tạo Tài khoản Mới</h2>
      <p class="subtitle">Chọn loại tiền tệ bạn muốn sử dụng cho tài khoản này.</p>
      <hr>

      <form @submit.prevent="handleSubmit" class="account-form">
        <div class="form-group">
          <label for="currency">Loại Tiền tệ:</label>
          <select id="currency" v-model="currency" required>
            <option v-for="c in availableCurrencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <button type="submit" :disabled="isSubmitting" class="btn-primary btn-submit">
          <i class="fas fa-spinner fa-spin" v-if="isSubmitting"></i>
          {{ isSubmitting ? 'Đang Tạo...' : 'Tạo Tài khoản' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-account-container {
    padding-top: 30px;
    display: flex;
    justify-content: center;
}
.create-account-card {
    width: 450px;
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.title {
    color: #00796b;
    font-size: 1.5em;
    font-weight: 700;
}
.subtitle {
    color: #777;
    margin-top: -10px;
}
hr {
    margin: 20px 0;
}
.account-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
}
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
}
.btn-primary {
    background-color: #00796b;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}
.btn-primary:hover:not(:disabled) {
    background-color: #004d40;
}
.btn-primary:disabled {
    background-color: #a7d1d1;
    cursor: not-allowed;
}
.btn-submit {
    margin-top: 10px;
}
</style>