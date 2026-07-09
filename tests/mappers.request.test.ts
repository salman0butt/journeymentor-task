import { describe, it, expect } from 'vitest'
import { toOfferRequestBody } from '../src/lib/mappers'
import type { SearchCriteria } from '../src/lib/types'

const base: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 2,
  cabin: 'economy',
}

describe('toOfferRequestBody', () => {
  it('maps a one-way search to a single slice', () => {
    const body = toOfferRequestBody(base) as any
    expect(body.data.slices).toEqual([
      { origin: 'LHR', destination: 'JFK', departure_date: '2026-08-01' },
    ])
    expect(body.data.passengers).toEqual([{ type: 'adult' }, { type: 'adult' }])
    expect(body.data.cabin_class).toBe('economy')
  })

  it('adds a return slice when returnDate is present', () => {
    const body = toOfferRequestBody({ ...base, returnDate: '2026-08-10' }) as any
    expect(body.data.slices).toHaveLength(2)
    expect(body.data.slices[1]).toEqual({
      origin: 'JFK',
      destination: 'LHR',
      departure_date: '2026-08-10',
    })
  })
})
