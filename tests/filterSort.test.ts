import { describe, it, expect } from 'vitest'
import { stopsBucket, departureBucket, applyFilters, sortOffers } from '../src/lib/filterSort'
import type { Offer } from '../src/lib/types'

function offer(over: Partial<Offer>): Offer {
  return {
    id: 'x',
    price: { amount: 100, currency: 'GBP' },
    airline: { name: 'A', iataCode: 'AA', logoUrl: null },
    slices: [],
    totalDurationMinutes: 100,
    departingAt: '2026-08-01T09:00:00',
    arrivingAt: '2026-08-01T11:00:00',
    stops: 0,
    baggage: [],
    ...over,
  }
}

const offers: Offer[] = [
  offer({
    id: 'a',
    price: { amount: 300, currency: 'GBP' },
    stops: 0,
    totalDurationMinutes: 200,
    departingAt: '2026-08-01T18:00:00',
    airline: { name: 'BA', iataCode: 'BA', logoUrl: null },
  }),
  offer({
    id: 'b',
    price: { amount: 100, currency: 'GBP' },
    stops: 2,
    totalDurationMinutes: 500,
    departingAt: '2026-08-01T06:00:00',
    airline: { name: 'LH', iataCode: 'LH', logoUrl: null },
  }),
  offer({
    id: 'c',
    price: { amount: 200, currency: 'GBP' },
    stops: 1,
    totalDurationMinutes: 300,
    departingAt: '2026-08-01T12:00:00',
    airline: { name: 'BA', iataCode: 'BA', logoUrl: null },
  }),
]

describe('stopsBucket', () => {
  it('buckets 0,1 directly and 2+ into 2', () => {
    expect(stopsBucket(0)).toBe(0)
    expect(stopsBucket(1)).toBe(1)
    expect(stopsBucket(3)).toBe(2)
  })
})

describe('departureBucket', () => {
  it('maps representative hours to the correct bucket', () => {
    expect(departureBucket('2026-08-01T06:00:00')).toBe('morning')
    expect(departureBucket('2026-08-01T14:00:00')).toBe('afternoon')
    expect(departureBucket('2026-08-01T19:00:00')).toBe('evening')
    expect(departureBucket('2026-08-01T23:00:00')).toBe('night')
    expect(departureBucket('2026-08-01T03:00:00')).toBe('night')
  })
})

describe('applyFilters', () => {
  it('filters by stop bucket', () => {
    const r = applyFilters(offers, {
      stops: [0],
      priceRange: null,
      airlines: [],
      departureTimes: [],
    })
    expect(r.map((o) => o.id)).toEqual(['a'])
  })
  it('filters by price range (inclusive)', () => {
    const r = applyFilters(offers, {
      stops: [],
      priceRange: [100, 200],
      airlines: [],
      departureTimes: [],
    })
    expect(r.map((o) => o.id).sort()).toEqual(['b', 'c'])
  })
  it('filters by airline', () => {
    const r = applyFilters(offers, {
      stops: [],
      priceRange: null,
      airlines: ['BA'],
      departureTimes: [],
    })
    expect(r.map((o) => o.id).sort()).toEqual(['a', 'c'])
  })
  it('filters by departure time bucket', () => {
    const timeOffers: Offer[] = [
      offer({ id: 'morning', departingAt: '2026-08-01T06:00:00' }),
      offer({ id: 'afternoon', departingAt: '2026-08-01T14:00:00' }),
      offer({ id: 'evening', departingAt: '2026-08-01T19:00:00' }),
      offer({ id: 'night', departingAt: '2026-08-01T23:00:00' }),
    ]
    const r = applyFilters(timeOffers, {
      stops: [],
      priceRange: null,
      airlines: [],
      departureTimes: ['morning'],
    })
    expect(r.map((o) => o.id)).toEqual(['morning'])
  })
})

describe('sortOffers', () => {
  it('sorts by price ascending', () => {
    expect(sortOffers(offers, 'price').map((o) => o.id)).toEqual(['b', 'c', 'a'])
  })
  it('sorts by duration ascending', () => {
    expect(sortOffers(offers, 'duration').map((o) => o.id)).toEqual(['a', 'c', 'b'])
  })
  it('sorts by departure time ascending', () => {
    expect(sortOffers(offers, 'departure').map((o) => o.id)).toEqual(['b', 'c', 'a'])
  })
  it('does not mutate the input', () => {
    const copy = [...offers]
    sortOffers(offers, 'price')
    expect(offers).toEqual(copy)
  })
})
