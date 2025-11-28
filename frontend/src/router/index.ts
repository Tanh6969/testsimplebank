import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import AccountView from '../views/AccountView.vue'
import TransferView from '../views/TransferView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView 
    },
    // 🌟 THÊM ROUTE ĐĂNG KÝ (GIẢI QUYẾT CẢNH BÁO TRƯỚC ĐÓ)
    // Bạn cần tạo file RegisterView.vue
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue') // Giả định
    },
    {
      path: '/',
      name: 'home',
      component: HomeView, 
      meta: { requiresAuth: true },
      children: [
        {
          path: '', 
          name: 'profile-default',
          redirect: '/profile' 
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: AccountView,
        },
        {
          path: 'transfers', 
          name: 'transfers',
          component: TransferView,
        },
      ]
    }
  ]
})

// 🌟 KHẮC PHỤC: Logic Router Guard ĐẦY ĐỦ VÀ CHÍNH XÁC
router.beforeEach((to, from, next) => {
  // Lấy thông tin bảo mật cho route sắp đến
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 🌟 LƯU Ý QUAN TRỌNG: LUÔN KIỂM TRA TRỰC TIẾP TỪ LOCALSTORAGE
  const isAuthenticated = localStorage.getItem('access_token'); 

  // 1. Nếu route cần bảo vệ VÀ chưa có token
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } 
  
  // 2. Nếu ĐÃ có token nhưng cố truy cập /login
  else if (to.path === '/login' && isAuthenticated) {
    // Chuyển về trang Dashboard chính (/profile)
    next('/profile');
  } 
  
  // 3. Cho phép đi tiếp (Đã đăng nhập và truy cập trang bảo vệ HOẶC truy cập trang công khai)
  else {
    next();
  }
});

export default router