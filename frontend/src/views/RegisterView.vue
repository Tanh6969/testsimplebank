<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const userForm = reactive({
    username: '',
    password: '',
    full_name: '',
    email: '',
});

const isSubmitting = ref(false);
const passwordError = ref(''); // 👈 Biến quản lý lỗi mật khẩu

// 🌟 HÀM MỚI: KIỂM TRA ĐỘ DÀI MẬT KHẨU
const validatePassword = () => {
    // Nếu password có nội dung và độ dài nhỏ hơn 6 ký tự
    if (userForm.password.length > 0 && userForm.password.length < 6) {
        passwordError.value = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return false;
    }
    passwordError.value = '';
    return true;
};

const handleRegister = async () => {
    // 🌟 THÊM KIỂM TRA MẬT KHẨU TRƯỚC KHI GỌI API
    if (!validatePassword()) {
        toast.add({severity: 'error', summary: 'Lỗi đầu vào', detail: 'Vui lòng sửa lỗi mật khẩu.', life: 3000});
        return;
    }
    
    isSubmitting.value = true;

    // Kiểm tra cơ bản các trường bắt buộc (nếu không cần thiết, bạn có thể dựa vào 'required' trong template)
    if (!userForm.username || !userForm.password || !userForm.full_name || !userForm.email) {
         isSubmitting.value = false;
         toast.add({severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin.', life: 3000});
         return;
    }

    try {
        await axios.post('http://localhost:8080/users', userForm, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        toast.add({
            severity: 'success',
            summary: 'Đăng ký thành công',
            detail: `Tài khoản ${userForm.username} đã được tạo. Vui lòng đăng nhập.`,
            life: 5000
        });

        setTimeout(() => {
             router.push('/login'); 
        }, 150);

    } catch (err: any) {
        console.error("Lỗi đăng ký:", err);
        const errorDetail = err.response?.data?.error || 'Lỗi không xác định.';
        
        let summary = 'Đăng ký thất bại';
        if (errorDetail.includes('unique_violation')) {
            summary = 'Tên đăng nhập hoặc Email đã tồn tại';
        }

        toast.add({
            severity: 'error',
            summary: summary,
            detail: errorDetail,
            life: 5000
        });
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <div class="register-page-container">
    <div class="register-card">
        <h2 class="title"><i class="fas fa-user-plus icon"></i> Đăng ký Tài khoản</h2>
        <p class="subtitle">Tạo tài khoản ngân hàng Simple Bank miễn phí.</p>
        <hr>

        <form @submit.prevent="handleRegister" class="register-form">
            
            <div class="form-group">
                <i class="fas fa-user icon-field"></i>
                <input v-model="userForm.username" type="text" placeholder="Username" required class="input-field">
            </div>

            <div class="form-group">
                <i class="fas fa-lock icon-field"></i>
                <input 
                    v-model="userForm.password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    class="input-field"
                    @input="validatePassword" 
                    :class="{'input-error': passwordError}"
                >
                <p v-if="passwordError" class="error-message">
                    {{ passwordError }}
                </p>
            </div>
            <div class="form-group">
                <i class="fas fa-signature icon-field"></i>
                <input v-model="userForm.full_name" type="text" placeholder="Full Name" required class="input-field">
            </div>
            
            <div class="form-group">
                <i class="fas fa-envelope icon-field"></i>
                <input v-model="userForm.email" type="email" placeholder="Email" required class="input-field">
            </div>

            <button type="submit" :disabled="isSubmitting || passwordError" class="btn-primary btn-submit">
                <i class="fas fa-spinner fa-spin" v-if="isSubmitting"></i>
                {{ isSubmitting ? 'Đang Đăng ký...' : 'Đăng ký' }}
            </button>
        </form>

        <p class="login-link-footer">Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.register-page-container {
    padding-top: 30px;
    display: flex;
    justify-content: center;
    min-height: 80vh;
    background-color: #f8f9fa;
}
.register-card {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
}
.title {
    color: #00796b;
    font-size: 1.8em;
    font-weight: 700;
    margin-bottom: 5px;
}
.subtitle {
    color: #777;
    font-size: 0.9em;
    margin-bottom: 25px;
}
hr {
    margin: 20px 0;
}
.register-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.form-group {
    position: relative;
    display: flex; /* Đảm bảo căn lề tốt hơn */
    flex-direction: column;
}
.input-field {
    width: 100%;
    padding: 12px 12px 12px 40px; /* Chừa chỗ cho icon */
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
    transition: border-color 0.3s;
}
.input-field:focus {
    border-color: #00796b;
    outline: none;
}
.icon-field {
    position: absolute;
    left: 15px;
    top: 12px; /* Điều chỉnh vị trí icon cho đúng */
    color: #00796b;
    font-size: 1em;
    transform: translateY(0); /* Loại bỏ transform */
    z-index: 10;
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
.login-link-footer {
    margin-top: 15px;
    font-size: 0.9em;
    color: #777;
}
.login-link-footer a {
    color: #00796b;
    text-decoration: none;
    font-weight: bold;
}

/* -------------------------------------- */
/* CSS MỚI CHO LỖI */
/* -------------------------------------- */

.input-error {
    border-color: #e53935 !important; /* Viền đỏ khi có lỗi */
}

.error-message {
    color: #e53935;
    font-size: 0.85em;
    text-align: left;
    margin-top: 5px;
    margin-bottom: -5px; 
    padding-left: 40px; 
}
</style>