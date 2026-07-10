import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { useSearchStore } from '../src/stores/search'
import type { SearchCriteria } from '../src/lib/types'

const staleCriteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-07-09',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

const currentCriteria: SearchCriteria = {
  ...staleCriteria,
  departureDate: '2026-07-10',
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-10T12:00:00Z'))
  localStorage.clear()
  setActivePinia(createPinia())
})

afterEach(() => {
  localStorage.clear()
  vi.useRealTimers()
})

describe('search store date safety', () => {
  it('does not activate criteria whose departure date is in the past', () => {
    const store = useSearchStore()

    store.setCriteria(staleCriteria)

    expect(store.criteria).toBeNull()
  })

  it('does not shift an active search to a past date', () => {
    const store = useSearchStore()
    store.setCriteria(currentCriteria)

    store.shiftDateTo('2026-07-09')

    expect(store.criteria?.departureDate).toBe('2026-07-10')
  })

  it('drops persisted criteria after its departure date becomes stale', () => {
    localStorage.setItem('search', JSON.stringify({ criteria: staleCriteria }))
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    createApp({}).use(pinia)
    setActivePinia(pinia)

    const store = useSearchStore()

    expect(store.criteria).toBeNull()
  })
})
