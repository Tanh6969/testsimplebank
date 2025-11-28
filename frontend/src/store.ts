import { reactive, readonly } from 'vue'
import type { AuthState } from './types/auth_state' // Giữ nguyên
import type { User } from './types/user' // Giữ nguyên

// ----------------------------------------------------
// 🌟 PHẦN MỚI: HÀM HỖ TRỢ LOCAL STORAGE
// ----------------------------------------------------

// Lưu token và user vào localStorage
function saveTokens(user: User, accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(user)) // Lưu thông tin user
}

// Xóa token và user khỏi localStorage
function removeTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
}

// ----------------------------------------------------
// 🌟 PHẦN CỐT LÕI CỦA STORE
// ----------------------------------------------------

const state = reactive<AuthState>({
  user: null,
  accessToken: null,
  refreshToken: null
})

function setUser(user: User, accessToken: string, refreshToken: string) {
  state.user = user
  state.accessToken = accessToken
  state.refreshToken = refreshToken
  
  // 🌟 SỬA ĐỔI: GỌI HÀM LƯU VÀO LOCAL STORAGE
  saveTokens(user, accessToken, refreshToken) 
}

function clearUser() {
  state.user = null
  state.accessToken = null
  state.refreshToken = null
  
  // 🌟 SỬA ĐỔI: GỌI HÀM XÓA KHỎI LOCAL STORAGE
  removeTokens()
}

/**
 * 🌟 HÀM MỚI: Khôi phục trạng thái người dùng từ localStorage 
 * (Cần gọi khi ứng dụng khởi động trong main.ts)
 */
function restoreUser() {
    const token = localStorage.getItem('access_token')
    const userJson = localStorage.getItem('user')

    if (token && userJson) {
        try {
            const user = JSON.parse(userJson) as User
            state.accessToken = token
            state.refreshToken = localStorage.getItem('refresh_token')
            state.user = user
            console.log("Store restored: User status retrieved from localStorage.")
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e)
            clearUser()
        }
    }
}


export default {
  state: readonly(state),
  setUser,
  clearUser,
  restoreUser // 🌟 EXPORT HÀM MỚI
}