import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SortKey } from '../lib/types'

export const useFiltersStore = defineStore(
  'filters',
  () => {
    const stops = ref<Array<0 | 1 | 2>>([])
    const priceRange = ref<[number, number] | null>(null)
    const airlines = ref<string[]>([])
    const sortKey = ref<SortKey>('price')

    function resetFilters() {
      stops.value = []
      priceRange.value = null
      airlines.value = []
    }

    return { stops, priceRange, airlines, sortKey, resetFilters }
  },
  { persist: { pick: ['stops', 'priceRange', 'airlines', 'sortKey'] } },
)
