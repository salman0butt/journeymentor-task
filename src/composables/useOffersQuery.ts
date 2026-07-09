import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { searchOffers } from '../services/duffelService'
import type { SearchCriteria } from '../lib/types'

export function useOffersQuery(criteria: Ref<SearchCriteria | null>) {
  return useQuery({
    // criteria must be reassigned, not mutated, for this key to change and refetch
    queryKey: computed(() => ['offers', criteria.value] as const),
    queryFn: ({ signal }) => searchOffers(criteria.value!, signal),
    enabled: computed(() => criteria.value !== null),
  })
}
