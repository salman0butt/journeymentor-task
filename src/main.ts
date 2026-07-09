import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App.vue'
import './assets/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24h — must be >= persist maxAge so persisted data isn't GC'd
      staleTime: 1000 * 60 * 5, // 5m — reload within this window shows cached results with no refetch
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({ storage: window.localStorage }),
  maxAge: 1000 * 60 * 60 * 24,
  // Persist only offer searches (not place-suggestion queries) — keeps the reload
  // "restore results" requirement without bloating storage with autocomplete caches.
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      Array.isArray(query.queryKey) && query.queryKey[0] === 'offers',
  },
})

createApp(App).use(pinia).use(VueQueryPlugin, { queryClient }).mount('#app')
