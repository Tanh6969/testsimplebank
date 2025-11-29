import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import store from '../store' // Import store để kiểm tra trạng thái đăng nhập

// Khai báo các Route
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, public: true } 
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'), // Bạn cần đảm bảo file này tồn tại
    meta: { requiresAuth: false, public: true } 
  },
  {
    // 🌟 ROUTE GỐC CHÍNH (LAYOUT) 🌟
    path: '/',
    name: 'HomeLayout',
    component: () => import('../views/HomeView.vue'), 
    meta: { requiresAuth: true },
    children: [
        {
            path: '', 
            name: 'HomeRedirect',
            redirect: '/profile' 
        },
        {
            path: 'profile', // Route: /profile
            name: 'Profile',
            component: () => import('../views/ProfileView.vue'),
        },
        {
            path: 'accounts', // Route: /accounts (List)
            name: 'Accounts',
            component: () => import('../views/AccountView.vue'),
        },
        // 🌟 KHẮC PHỤC: THÊM ROUTE TẠO TÀI KHOẢN 🌟
        {
            path: 'accounts/create', // Route: /accounts/create
            name: 'AccountCreate',
            component: () => import('../views/AccountCreateView.vue'),
        },
        {
            path: 'transfers', // Route: /transfers
            name: 'Transfers',
            component: () => import('../views/TransferView.vue'),
        },
    ]
  },
  // THÊM ROUTE 404 (Nếu không khớp bất kỳ route nào, chuyển về /profile)
  {
    path: '/:pathMatch(.*)*', 
    redirect: '/profile' 
  }
]

// 2. Tạo Router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 3. Navigation Guard (Giữ nguyên logic kiểm tra đăng nhập)
router.beforeEach((to, from, next) => {
  const loggedIn = store.state.user 
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isPublic = to.meta.public

  if (requiresAuth && !loggedIn) {
    return next('/login')
  }

  if (loggedIn && isPublic) {
    return next('/profile')
  }

  next()
})

export default router