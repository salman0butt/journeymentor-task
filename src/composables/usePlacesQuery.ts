import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getPlaceSuggestions } from '../services/duffelService'
import { useDebounce } from './useDebounce'

const DEBOUNCE_MS = 300

export function usePlacesQuery(query: Ref<string>) {
  const debounced = ref(query.value)

  const setDebounced = useDebounce((value: string) => {
    debounced.value = value
  }, DEBOUNCE_MS)

  watch(query, (value) => setDebounced(value))

  return useQuery({
    queryKey: computed(() => ['places', debounced.value.trim()] as const),
    queryFn: ({ signal }) => getPlaceSuggestions(debounced.value.trim(), signal),
    enabled: computed(() => debounced.value.trim().length >= 2),
    staleTime: 1000 * 60,
  })
}
