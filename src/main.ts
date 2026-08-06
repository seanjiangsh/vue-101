import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

// Pinia must be installed on the app before any store is used.
createApp(App).use(createPinia()).use(router).mount('#app')
