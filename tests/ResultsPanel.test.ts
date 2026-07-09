import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('../src/composables/useOffersQuery', () => ({ useOffersQuery: vi.fn() }))
import { useOffersQuery } from '../src/composables/useOffersQuery'
import ResultsPanel from '../src/components/ResultsPanel.vue'
import { useSearchStore } from '../src/stores/search'
import type { Offer } from '../src/lib/types'

function setQuery(state: {
  data?: Offer[]
  isError?: boolean
  isLoading?: boolean
  error?: Error | null
}) {
  ;(useOffersQuery as any).mockReturnValue({
    data: ref(state.data ?? []),
    isError: ref(state.isError ?? false),
    isLoading: ref(state.isLoading ?? false),
    error: ref(state.error ?? null),
    refetch: vi.fn(),
  })
}
const sampleOffer = (over: Partial<Offer> = {}): Offer => ({
  id: 'o1',
  price: { amount: 100, currency: 'USD' },
  airline: { name: 'BA', iataCode: 'BA', logoUrl: null },
  slices: [],
  totalDurationMinutes: 100,
  departingAt: '2026-08-01T09:00:00',
  arrivingAt: '2026-08-01T11:00:00',
  stops: 0,
  baggage: [],
  ...over,
})
const criteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy' as const,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('ResultsPanel view states', () => {
  it('idle before any search (criteria null)', () => {
    setQuery({})
    const w = mount(ResultsPanel)
    expect(w.text()).toMatch(/search for flights/i)
  })

  it('loading when the query is loading', () => {
    setQuery({ isLoading: true })
    const s = useSearchStore()
    s.criteria = { ...criteria }
    const w = mount(ResultsPanel)
    expect(w.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('error state with a retry button on query error', () => {
    setQuery({ isError: true, error: new Error('Search failed (500)') })
    const s = useSearchStore()
    s.criteria = { ...criteria }
    const w = mount(ResultsPanel)
    expect(w.text()).toMatch(/search failed|retry/i)
    expect(w.find('button').exists()).toBe(true)
  })

  it('empty state on a successful search with 0 offers', () => {
    setQuery({ data: [] })
    const s = useSearchStore()
    s.criteria = { ...criteria }
    const w = mount(ResultsPanel)
    expect(w.text()).toMatch(/no flights|match this search/i)
  })

  it('renders offer cards on success', () => {
    setQuery({ data: [sampleOffer()] })
    const s = useSearchStore()
    s.criteria = { ...criteria }
    const w = mount(ResultsPanel)
    expect(w.findAll('article').length).toBeGreaterThan(0)
  })
})
