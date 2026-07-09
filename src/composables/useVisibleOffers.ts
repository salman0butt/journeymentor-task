import { computed, type Ref } from 'vue'
import { useFiltersStore } from '../stores/filters'
import { applyFilters, sortOffers } from '../lib/filterSort'
import type { Offer } from '../lib/types'

export function useVisibleOffers(offers: Ref<Offer[]>) {
  const filters = useFiltersStore()

  const visibleOffers = computed(() =>
    sortOffers(
      applyFilters(offers.value, {
        stops: filters.stops,
        priceRange: filters.priceRange,
        airlines: filters.airlines,
        departureTimes: filters.departureTimes,
      }),
      filters.sortKey,
    ),
  )

  return { visibleOffers }
}
