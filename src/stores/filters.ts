import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SortKey, DepartureBucket } from '../lib/types'

export const useFiltersStore = defineStore(
  'filters',
  () => {
    const stops = ref<Array<0 | 1 | 2>>([])
    const priceRange = ref<[number, number] | null>(null)
    const airlines = ref<string[]>([])
    const departureTimes = ref<DepartureBucket[]>([])
    const sortKey = ref<SortKey>('price')

    function resetFilters() {
      stops.value = []
      priceRange.value = null
      airlines.value = []
      departureTimes.value = []
    }

    return { stops, priceRange, airlines, departureTimes, sortKey, resetFilters }
  },
  { persist: { pick: ['stops', 'priceRange', 'airlines', 'departureTimes', 'sortKey'] } },
)
