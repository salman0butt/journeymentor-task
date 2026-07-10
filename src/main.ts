import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { vueQueryOptions } from './plugins/vueQuery'
import App from './App.vue'
import './assets/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(VueQueryPlugin, vueQueryOptions).mount('#app')
