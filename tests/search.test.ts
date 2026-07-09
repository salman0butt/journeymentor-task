import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { SearchCriteria } from '../src/lib/types'
import { useSearchStore } from '../src/stores/search'

const criteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

beforeEach(() => setActivePinia(createPinia()))

describe('useSearchStore.setCriteria', () => {
  it('stores a new object, not the passed reference', () => {
    const store = useSearchStore()
    store.setCriteria(criteria)
    expect(store.criteria).toEqual(criteria)
    expect(store.criteria).not.toBe(criteria)
  })
})

describe('useSearchStore.shiftDateTo', () => {
  it('changes only the departure date and leaves other fields untouched', () => {
    const store = useSearchStore()
    store.setCriteria(criteria)
    store.shiftDateTo('2026-08-03')
    expect(store.criteria?.departureDate).toBe('2026-08-03')
    expect(store.criteria?.origin).toBe('LHR')
    expect(store.criteria?.destination).toBe('JFK')
    expect(store.criteria?.passengers).toBe(1)
    expect(store.criteria?.cabin).toBe('economy')
  })
})
