import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { searchOffers } from '../services/duffelService'
import type { SearchCriteria } from '../lib/types'

export function useOffersQuery(criteria: Ref<SearchCriteria | null>) {
  return useQuery({
    // `criteria` must be REASSIGNED to a new object (not mutated in place) for the
    // query to re-run — this computed only tracks the ref reassignment, not deep
    // mutations of the object it points to.
    queryKey: computed(() => ['offers', criteria.value] as const),
    queryFn: ({ signal }) => searchOffers(criteria.value!, signal),
    enabled: computed(() => criteria.value !== null),
  })
}
