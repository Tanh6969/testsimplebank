import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primevue/resources/themes/lara-light-green/theme.css' // CSS Theme của PrimeVue
import 'primevue/resources/primevue.min.css' // CSS cốt lõi của PrimeVue
import 'primeicons/primeicons.css' // CSS Icon của PrimeVue

// 🌟 THÊM IMPORT CHO STORE
import store from './store' 


const app = createApp(App)

// 🌟 KHẮC PHỤC LỖI KẸT: Khôi phục trạng thái User từ localStorage 
// Điều này phải được gọi trước khi Vue Router được sử dụng
if (store && store.restoreUser) {
    store.restoreUser();
}

app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.mount('#app')