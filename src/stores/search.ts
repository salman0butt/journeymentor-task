import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SearchCriteria } from '../lib/types'

export const useSearchStore = defineStore(
  'search',
  () => {
    const criteria = ref<SearchCriteria | null>(null)

    // Always assign a NEW object so useOffersQuery's key changes and refetches.
    function setCriteria(next: SearchCriteria) {
      criteria.value = { ...next }
    }

    function shiftDateTo(date: string) {
      if (criteria.value) criteria.value = { ...criteria.value, departureDate: date }
    }

    function reset() {
      criteria.value = null
    }

    return { criteria, setCriteria, shiftDateTo, reset }
  },
  { persist: { pick: ['criteria'] } },
)
