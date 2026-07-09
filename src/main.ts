import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/vue-query'
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
  // Persist only successful offer searches (not place-suggestion queries) — keeps the
  // reload "restore results" requirement without bloating storage with autocomplete
  // caches. AND-ing with defaultShouldDehydrateQuery preserves TanStack's default
  // status === 'success' gate: without it, a pending/fetching offers query gets its
  // in-flight Promise dehydrated, JSON.stringify turns it into `{}`, and on the next
  // reload hydrate() calls `.then()` on that `{}` and throws, causing
  // persistQueryClientRestore to wipe the entire persisted cache.
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      defaultShouldDehydrateQuery(query) &&
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === 'offers',
  },
})

createApp(App).use(pinia).use(VueQueryPlugin, { queryClient }).mount('#app')
