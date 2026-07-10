import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const GC_TIME = 1000 * 60 * 60 * 24 // 24 hours
const STALE_TIME = 1000 * 60 * 5 // 5 minutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: GC_TIME,
      staleTime: STALE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const persister = createAsyncStoragePersister({ storage: window.localStorage })

export function offersShouldDehydrate(query: any) {
  return (
    defaultShouldDehydrateQuery(query) &&
    Array.isArray(query.queryKey) &&
    query.queryKey[0] === 'offers'
  )
}

export const vueQueryOptions = {
  queryClient,
  clientPersister: (qc: QueryClient) =>
    persistQueryClient({
      queryClient: qc,
      persister,
      maxAge: GC_TIME,
      dehydrateOptions: {
        shouldDehydrateQuery: offersShouldDehydrate,
      },
    }),
}

export { queryClient }
