import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref, h } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { usePlacesQuery } from '../src/composables/usePlacesQuery'

vi.mock('../src/services/duffelService', () => ({
  searchOffers: vi.fn(),
  getPlaceSuggestions: vi.fn(),
}))

import { getPlaceSuggestions } from '../src/services/duffelService'

function mountWithHook(initial: string) {
  const queryRef = ref(initial)
  let result!: ReturnType<typeof usePlacesQuery>

  const TestComponent = defineComponent({
    setup() {
      result = usePlacesQuery(queryRef)
      return () => h('div')
    },
  })

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = mount(TestComponent, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })

  return { wrapper, queryRef, result: () => result }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('usePlacesQuery', () => {
  it('stays disabled and never calls getPlaceSuggestions for a query under 2 chars', async () => {
    const { queryRef } = mountWithHook('l')
    queryRef.value = 'l'
    await nextTick()
    vi.advanceTimersByTime(300)
    vi.useRealTimers()
    await flushPromises()

    expect(getPlaceSuggestions).not.toHaveBeenCalled()
  })

  it('debounces input and calls getPlaceSuggestions with the settled value once it reaches 2+ chars', async () => {
    vi.mocked(getPlaceSuggestions).mockResolvedValue([])
    const { queryRef } = mountWithHook('')

    queryRef.value = 'l'
    await nextTick() // let the watcher register its debounce timer
    vi.advanceTimersByTime(100)
    queryRef.value = 'lo'
    await nextTick()
    vi.advanceTimersByTime(100)
    queryRef.value = 'lon'
    await nextTick()
    // Full debounce window elapses only after the last change.
    vi.advanceTimersByTime(300)
    vi.useRealTimers()
    await flushPromises()

    expect(getPlaceSuggestions).toHaveBeenCalledTimes(1)
    expect(getPlaceSuggestions).toHaveBeenCalledWith('lon', expect.anything())
  })
})
