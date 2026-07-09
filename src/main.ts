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
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const persister = createSyncStoragePersister({ storage: window.localStorage })

createApp(App)
  .use(pinia)
  .use(VueQueryPlugin, {
    queryClient,
    clientPersister: (qc) =>
      persistQueryClient({
        queryClient: qc,
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          // AND with defaultShouldDehydrateQuery so an in-flight query never dehydrates and wipes the cache on restore
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) &&
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'offers',
        },
      }),
  })
  .mount('#app')
