import { describe, it, expect } from 'vitest'
import { mapOffer, mapPlace } from '../src/lib/mappers'
import { rawOffer } from './fixtures/offer'

describe('mapOffer', () => {
  const offer = mapOffer(rawOffer)

  it('maps price, airline, stops, times, duration, layover and baggage', () => {
    expect(offer.price).toEqual({ amount: 550.2, currency: 'GBP' })
    expect(offer.airline).toEqual({
      name: 'British Airways',
      iataCode: 'BA',
      logoUrl: 'https://logo/ba.svg',
    })
    expect(offer.stops).toBe(1)
    expect(offer.departingAt).toBe('2026-08-01T09:00:00')
    expect(offer.arrivingAt).toBe('2026-08-01T20:00:00')
    expect(offer.totalDurationMinutes).toBe(660)
    expect(offer.slices[0].segments[0].layoverAfterMinutes).toBe(90)
    expect(offer.slices[0].segments[1].layoverAfterMinutes).toBeNull()
    expect(offer.baggage).toEqual([
      { type: 'carry_on', quantity: 1 },
      { type: 'checked', quantity: 0 },
    ])
  })
})

describe('mapPlace', () => {
  it('maps a place suggestion', () => {
    const p = mapPlace({ type: 'airport', name: 'Heathrow', iata_code: 'LHR', city_name: 'London' })
    expect(p).toEqual({ type: 'airport', name: 'Heathrow', iataCode: 'LHR', cityName: 'London' })
  })
})
