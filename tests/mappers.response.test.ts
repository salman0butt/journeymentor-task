import { describe, it, expect } from 'vitest'
import { mapOffer, mapPlace } from '../src/lib/mappers'
import { rawOffer } from './fixtures/offer'

describe('mapOffer', () => {
  const offer = mapOffer(rawOffer)

  it('maps price as a number + currency', () => {
    expect(offer.price).toEqual({ amount: 550.2, currency: 'GBP' })
  })
  it('maps the airline', () => {
    expect(offer.airline).toEqual({
      name: 'British Airways',
      iataCode: 'BA',
      logoUrl: 'https://logo/ba.svg',
    })
  })
  it('computes stops as segments-1 on the primary slice', () => {
    expect(offer.stops).toBe(1)
  })
  it('takes departure from the first segment and arrival from the last', () => {
    expect(offer.departingAt).toBe('2026-08-01T09:00:00')
    expect(offer.arrivingAt).toBe('2026-08-01T20:00:00')
  })
  it('computes total duration in minutes across slices', () => {
    expect(offer.totalDurationMinutes).toBe(660) // PT11H0M
  })
  it('computes layover after the first segment', () => {
    // arrive DUB 10:30, depart DUB 12:00 => 90 minutes
    expect(offer.slices[0].segments[0].layoverAfterMinutes).toBe(90)
    expect(offer.slices[0].segments[1].layoverAfterMinutes).toBeNull()
  })
  it('collects baggage from the primary slice first segment', () => {
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
