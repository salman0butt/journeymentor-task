import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getPlaceSuggestions } from '../services/duffelService'

const DEBOUNCE_MS = 300

export function usePlacesQuery(query: Ref<string>) {
  const debounced = ref(query.value)
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(query, (value) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, DEBOUNCE_MS)
  })

  onScopeDispose(() => {
    if (timer) clearTimeout(timer)
  })

  return useQuery({
    queryKey: computed(() => ['places', debounced.value.trim()] as const),
    queryFn: ({ signal }) => getPlaceSuggestions(debounced.value.trim(), signal),
    enabled: computed(() => debounced.value.trim().length >= 2),
    staleTime: 1000 * 60,
  })
}
