import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, h } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { useOffersQuery } from '../src/composables/useOffersQuery'
import { rawOffer } from './fixtures/offer'
import { mapOffers } from '../src/lib/mappers'
import type { SearchCriteria } from '../src/lib/types'

vi.mock('../src/services/duffelService', () => ({
  searchOffers: vi.fn(),
  getPlaceSuggestions: vi.fn(),
}))

import { searchOffers } from '../src/services/duffelService'

const criteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

function mountWithHook(initial: SearchCriteria | null) {
  const criteriaRef = ref<SearchCriteria | null>(initial)
  let result!: ReturnType<typeof useOffersQuery>

  const TestComponent = defineComponent({
    setup() {
      result = useOffersQuery(criteriaRef)
      return () => h('div')
    },
  })

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = mount(TestComponent, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })

  return { wrapper, criteriaRef, result: () => result }
}

afterEach(() => vi.restoreAllMocks())

describe('useOffersQuery', () => {
  it('does not call searchOffers when criteria is null (disabled query)', async () => {
    const { result } = mountWithHook(null)
    await flushPromises()

    expect(searchOffers).not.toHaveBeenCalled()
    expect(result().isFetching.value).toBe(false)
  })

  it('calls searchOffers and exposes mapped offers on data when criteria is provided', async () => {
    const offers = mapOffers([rawOffer])
    vi.mocked(searchOffers).mockResolvedValue(offers)

    const { result } = mountWithHook(criteria)
    await flushPromises()

    expect(searchOffers).toHaveBeenCalledWith(criteria, expect.anything())
    expect(result().data.value).toEqual(offers)
  })
})
