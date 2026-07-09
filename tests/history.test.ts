import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore } from '../src/stores/history'
import type { SearchCriteria } from '../src/lib/types'

const criteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

beforeEach(() => setActivePinia(createPinia()))

describe('useHistoryStore.record', () => {
  it('prepends an entry with a readable label', () => {
    const store = useHistoryStore()
    store.record(criteria)
    expect(store.entries[0].criteria).toEqual(criteria)
    expect(store.entries[0].label).toContain('LHR')
    expect(store.entries[0].label).toContain('JFK')
  })

  it('deduplicates identical consecutive searches', () => {
    const store = useHistoryStore()
    store.record(criteria)
    store.record(criteria)
    expect(store.entries).toHaveLength(1)
  })

  it('caps history at 8 entries', () => {
    const store = useHistoryStore()
    for (let i = 0; i < 12; i++) store.record({ ...criteria, destination: `X${i}` })
    expect(store.entries.length).toBeLessThanOrEqual(8)
  })
})
