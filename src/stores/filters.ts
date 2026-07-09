import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSearchStore } from './search'
import { applyFilters, sortOffers } from '../lib/filterSort'
import type { Offer, SortKey } from '../lib/types'

export const useFiltersStore = defineStore(
  'filters',
  () => {
    const stops = ref<Array<0 | 1 | 2>>([])
    const priceRange = ref<[number, number] | null>(null)
    const airlines = ref<string[]>([])
    const sortKey = ref<SortKey>('price')

    const visibleOffers = computed<Offer[]>(() => {
      const search = useSearchStore()
      const filtered = applyFilters(search.offers, {
        stops: stops.value,
        priceRange: priceRange.value,
        airlines: airlines.value,
      })
      return sortOffers(filtered, sortKey.value)
    })

    function resetFilters() {
      stops.value = []
      priceRange.value = null
      airlines.value = []
    }

    return { stops, priceRange, airlines, sortKey, visibleOffers, resetFilters }
  },
  { persist: { pick: ['stops', 'priceRange', 'airlines', 'sortKey'] } },
)
