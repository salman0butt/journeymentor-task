import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchOffers, getPlaceSuggestions } from '../src/services/duffelService'
import { rawOffer } from './fixtures/offer'
import type { SearchCriteria } from '../src/lib/types'

const criteria: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

afterEach(() => vi.restoreAllMocks())

describe('searchOffers', () => {
  it('POSTs to /api/search and returns mapped offers', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: { offers: [rawOffer] } }),
    } as Response)

    const offers = await searchOffers(criteria)

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/search',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    expect(offers).toHaveLength(1)
    expect(offers[0].id).toBe('off_123')
  })

  it('throws on a non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    await expect(searchOffers(criteria)).rejects.toThrow()
  })
})

describe('getPlaceSuggestions', () => {
  it('GETs /api/places with the query and returns mapped places', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ type: 'airport', name: 'Heathrow', iata_code: 'LHR', city_name: 'London' }],
      }),
    } as Response)

    const result = await getPlaceSuggestions('lon')

    expect(fetchSpy).toHaveBeenCalledWith('/api/places?query=lon', expect.anything())
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      type: 'airport',
      name: 'Heathrow',
      iataCode: 'LHR',
      cityName: 'London',
    })
  })
})
