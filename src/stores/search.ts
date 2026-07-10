import { defineStore } from 'pinia'
import { ref } from 'vue'
import { hasErrors, validateCriteria } from '../lib/validation'
import type { SearchCriteria } from '../lib/types'

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isCurrentCriteria(criteria: SearchCriteria): boolean {
  return !hasErrors(validateCriteria(criteria, todayIso()))
}

export const useSearchStore = defineStore(
  'search',
  () => {
    const criteria = ref<SearchCriteria | null>(null)

    // Always assign a NEW object so useOffersQuery's key changes and refetches.
    function setCriteria(next: SearchCriteria) {
      criteria.value = isCurrentCriteria(next) ? { ...next } : null
    }

    function shiftDateTo(date: string) {
      if (!criteria.value) return
      const shifted = { ...criteria.value, departureDate: date }
      if (isCurrentCriteria(shifted)) criteria.value = shifted
    }

    return { criteria, setCriteria, shiftDateTo }
  },
  {
    persist: {
      pick: ['criteria'],
      afterHydrate: ({ store }) => {
        const hydrated = store.criteria as SearchCriteria | null
        if (hydrated && !isCurrentCriteria(hydrated)) store.criteria = null
      },
    },
  },
)
