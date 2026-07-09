import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDuffelClient } from '../composables/useDuffelClient'
import type { Offer, SearchCriteria, SearchStatus } from '../lib/types'

export const useSearchStore = defineStore(
  'search',
  () => {
    const client = useDuffelClient()

    const criteria = ref<SearchCriteria | null>(null)
    const offers = ref<Offer[]>([])
    const status = ref<SearchStatus>('idle')
    const error = ref<string | null>(null)

    let activeRequestId = 0
    let controller: AbortController | null = null

    async function run(next: SearchCriteria) {
      criteria.value = next
      const requestId = ++activeRequestId
      controller?.abort()
      controller = new AbortController()
      status.value = 'loading'
      error.value = null
      try {
        const result = await client.search(next, controller.signal)
        if (requestId !== activeRequestId) return // stale response — ignore
        offers.value = result
        status.value = result.length === 0 ? 'empty' : 'success'
      } catch (err) {
        if (requestId !== activeRequestId) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        status.value = 'error'
        error.value = err instanceof Error ? err.message : 'Something went wrong'
      }
    }

    async function search(next: SearchCriteria) {
      await run(next)
    }

    async function shiftDateTo(date: string) {
      if (!criteria.value) return
      await run({ ...criteria.value, departureDate: date })
    }

    function reset() {
      criteria.value = null
      offers.value = []
      status.value = 'idle'
      error.value = null
    }

    return { criteria, offers, status, error, search, shiftDateTo, reset }
  },
  {
    persist: {
      pick: ['criteria', 'offers', 'status'],
    },
  },
)
