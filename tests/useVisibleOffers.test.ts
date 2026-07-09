import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useFiltersStore } from '../src/stores/filters'
import { useVisibleOffers } from '../src/composables/useVisibleOffers'
import type { Offer } from '../src/lib/types'

const offer = (
  id: string,
  amount: number,
  stops: number,
  departingAt = '2026-08-01T09:00:00',
): Offer => ({
  id,
  price: { amount, currency: 'GBP' },
  airline: { name: 'A', iataCode: 'AA', logoUrl: null },
  slices: [],
  totalDurationMinutes: amount,
  departingAt,
  arrivingAt: '2026-08-01T11:00:00',
  stops,
  baggage: [],
})

beforeEach(() => setActivePinia(createPinia()))

describe('useVisibleOffers', () => {
  it('applies filters then sort over the given offers ref', () => {
    const offers = ref<Offer[]>([offer('a', 300, 0), offer('b', 100, 2), offer('c', 200, 1)])
    const filters = useFiltersStore()
    filters.sortKey = 'price'
    const { visibleOffers } = useVisibleOffers(offers)
    expect(visibleOffers.value.map((o) => o.id)).toEqual(['b', 'c', 'a'])
    filters.stops = [0]
    expect(visibleOffers.value.map((o) => o.id)).toEqual(['a'])
  })

  it('applies the departure-time filter from the store', () => {
    const offers = ref<Offer[]>([
      offer('morning', 100, 0, '2026-08-01T06:00:00'),
      offer('afternoon', 200, 0, '2026-08-01T14:00:00'),
      offer('evening', 300, 0, '2026-08-01T19:00:00'),
      offer('night', 400, 0, '2026-08-01T23:00:00'),
    ])
    const filters = useFiltersStore()
    filters.departureTimes = ['morning']
    const { visibleOffers } = useVisibleOffers(offers)
    expect(visibleOffers.value.map((o) => o.id)).toEqual(['morning'])
  })
})
