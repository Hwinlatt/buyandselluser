import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const lang = localStorage.getItem('lang') || 'en';

createApp(App).use(store)
.use(router)
.use(VueSweetalert2).mount('#app')
