import { describe, it, expect } from 'vitest'
import {
  makeCriteriaSchema,
  offerSearchResponseSchema,
  placesResponseSchema,
} from '../src/lib/schemas'
import type { SearchCriteria } from '../src/lib/types'
import { rawOffer } from './fixtures/offer'

const TODAY = '2026-07-09'

const valid: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}

function issuePaths(result: ReturnType<ReturnType<typeof makeCriteriaSchema>['safeParse']>) {
  if (result.success) return []
  return result.error.issues.map((i) => i.path.join('.'))
}

describe('makeCriteriaSchema', () => {
  const schema = makeCriteriaSchema(TODAY)

  it('accepts a valid one-way search', () => {
    const result = schema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects missing origin', () => {
    const result = schema.safeParse({ ...valid, origin: '' })
    expect(result.success).toBe(false)
    expect(issuePaths(result)).toContain('origin')
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.join('.') === 'origin')
      expect(issue?.message).toBe('Select an origin')
    }
  })

  it('rejects origin === destination, attaching the error to destination', () => {
    const result = schema.safeParse({ ...valid, destination: 'LHR' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.join('.') === 'destination')
      expect(issue?.message).toBe('Origin and destination must differ')
    }
  })
})

describe('offerSearchResponseSchema', () => {
  it('parses a realistic offer-search response', () => {
    const result = offerSearchResponseSchema.safeParse({ data: { offers: [rawOffer] } })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.data.offers[0].id).toBe('off_123')
    }
  })

  it('tolerates the same null/absent edge shapes the mappers guard with `?.`', () => {
    const segmentWithoutPassengers: Record<string, unknown> = {
      ...rawOffer.slices[0].segments[0],
    }
    delete segmentWithoutPassengers.passengers
    const segment = { ...segmentWithoutPassengers, marketing_carrier: null }
    const offerWithoutOwner: Record<string, unknown> = { ...rawOffer }
    delete offerWithoutOwner.owner
    const offer = {
      ...offerWithoutOwner,
      slices: [{ ...rawOffer.slices[0], segments: [segment, rawOffer.slices[0].segments[1]] }],
    }
    const result = offerSearchResponseSchema.safeParse({ data: { offers: [offer] } })
    expect(result.success).toBe(true)
  })
})

describe('placesResponseSchema', () => {
  const rawPlace = { type: 'airport', name: 'Heathrow', iata_code: 'LHR', city_name: 'London' }

  it('parses a realistic place-suggestions response', () => {
    const result = placesResponseSchema.safeParse({ data: [rawPlace] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.data[0].iata_code).toBe('LHR')
    }
  })
})
