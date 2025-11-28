<template>
  <div class="container">
    <h2>💸 Thực hiện Chuyển khoản</h2>
    
    <form @submit.prevent="handleTransfer" class="transfer-form">
      
      <div class="form-group">
        <label for="fromAccount">Tài khoản Gửi đi (ID):</label>
        <input id="fromAccount" v-model="form.from_account_id" type="number" required>
      </div>

      <div class="form-group">
        <label for="toAccount">Tài khoản Nhận (ID):</label>
        <input id="toAccount" v-model="form.to_account_id" type="number" required>
      </div>
      
      <div class="form-group">
        <label for="amount">Số tiền:</label>
        <input id="amount" v-model="form.amount" type="number" min="0.01" step="0.01" required>
      </div>

      <div class="form-group">
        <label for="currency">Tiền tệ:</label>
        <select id="currency" v-model="form.currency" required>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="VND">VND</option>
        </select>
      </div>

      <button type="submit" :disabled="isSubmitting" class="submit-button">
        {{ isSubmitting ? 'Đang Chuyển...' : 'Chuyển Khoản' }}
      </button>
    </form>
    
    <p v-if="message" :class="messageType">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'TransferView',
  setup() {
    const form = reactive({
      from_account_id: null,
      to_account_id: null,
      amount: null,
      currency: 'USD' as string,
    });

    const isSubmitting = ref(false);
    const message = ref<string | null>(null);
    const messageType = ref<'success' | 'error'>('success');

    const handleTransfer = async () => {
      isSubmitting.value = true;
      message.value = null;
      
      try {
        const token = localStorage.getItem('access_token');
        
        await axios.post('http://localhost:8080/transfers', form, {
          headers: {
            // 🌟 CỰC KỲ QUAN TRỌNG: Gửi Bearer Token để xác thực
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });
        
        message.value = 'Chuyển khoản thành công!';
        messageType.value = 'success';
        // Reset form
        form.from_account_id = null;
        form.to_account_id = null;
        form.amount = null;

      } catch (err: any) {
        message.value = `Chuyển khoản thất bại: ${err.response?.data?.error || 'Lỗi không xác định'}`;
        messageType.value = 'error';
        console.error(err);
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      isSubmitting,
      message,
      messageType,
      handleTransfer,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 500px;
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
.transfer-form {
  display: grid;
  gap: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.submit-button {
  padding: 12px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.submit-button:disabled {
  background-color: #a7d1d1;
  cursor: not-allowed;
}
.success { color: green; margin-top: 15px; font-weight: bold; }
.error { color: red; margin-top: 15px; font-weight: bold; }
</style>