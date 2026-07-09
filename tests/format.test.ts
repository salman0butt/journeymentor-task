import { describe, it, expect } from 'vitest'
import {
  parseDurationToMinutes,
  formatDuration,
  formatTime,
  formatPrice,
  formatDayLabel,
} from '../src/lib/format'
import { dayWindow } from '../src/lib/format'

describe('parseDurationToMinutes', () => {
  it('parses hours and minutes', () => {
    expect(parseDurationToMinutes('PT8H30M')).toBe(510)
  })
})

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(510)).toBe('8h 30m')
  })
})

describe('formatTime', () => {
  it('extracts HH:mm from an ISO datetime', () => {
    expect(formatTime('2026-08-01T09:05:00')).toBe('09:05')
  })
})

describe('formatPrice', () => {
  it('formats known currencies with a symbol', () => {
    expect(formatPrice({ amount: 550.2, currency: 'GBP' })).toBe('£550.20')
  })
})

describe('formatDayLabel', () => {
  it('formats a date as weekday day month', () => {
    expect(formatDayLabel('2026-08-01')).toBe('Sat 1 Aug')
  })
})

describe('dayWindow', () => {
  it('returns 2*radius+1 consecutive dates centred on the input', () => {
    expect(dayWindow('2026-08-01', 3)).toEqual([
      '2026-07-29',
      '2026-07-30',
      '2026-07-31',
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
      '2026-08-04',
    ])
  })
})
