import { describe, it, expect } from 'vitest'
import { validateCriteria, hasErrors } from '../src/lib/validation'
import type { SearchCriteria } from '../src/lib/types'

const valid: SearchCriteria = {
  origin: 'LHR',
  destination: 'JFK',
  departureDate: '2026-08-01',
  returnDate: null,
  passengers: 1,
  cabin: 'economy',
}
const TODAY = '2026-07-09'

describe('validateCriteria', () => {
  it('accepts a valid one-way search', () => {
    expect(hasErrors(validateCriteria(valid, TODAY))).toBe(false)
  })
  it('rejects missing origin', () => {
    expect(validateCriteria({ ...valid, origin: '' }, TODAY).origin).toBeTruthy()
  })
  it('rejects origin === destination', () => {
    const e = validateCriteria({ ...valid, destination: 'LHR' }, TODAY)
    expect(e.destination).toBeTruthy()
  })
  it('rejects a past departure date', () => {
    expect(
      validateCriteria({ ...valid, departureDate: '2026-07-08' }, TODAY).departureDate,
    ).toBeTruthy()
  })
  it('rejects a return date before departure', () => {
    const e = validateCriteria({ ...valid, returnDate: '2026-07-31' }, TODAY)
    expect(e.returnDate).toBeTruthy()
  })
  it('rejects fewer than 1 passenger', () => {
    expect(validateCriteria({ ...valid, passengers: 0 }, TODAY).passengers).toBeTruthy()
  })
})
