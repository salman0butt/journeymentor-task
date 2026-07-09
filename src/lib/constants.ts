import type { CabinClass, DepartureBucket } from './types'

export const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]

export const STOP_OPTIONS: { value: 0 | 1 | 2; label: string }[] = [
  { value: 0, label: 'Nonstop' },
  { value: 1, label: '1 stop' },
  { value: 2, label: '2+ stops' },
]

// Fixed time-of-day buckets for the departure-time filter (from-hour inclusive,
// to-hour exclusive; 'night' wraps past midnight). Single source for both the
// filter logic and the UI labels.
export const DEPARTURE_BUCKETS: {
  value: DepartureBucket
  label: string
  from: number
  to: number
}[] = [
  { value: 'morning', label: 'Morning', from: 5, to: 12 },
  { value: 'afternoon', label: 'Afternoon', from: 12, to: 17 },
  { value: 'evening', label: 'Evening', from: 17, to: 21 },
  { value: 'night', label: 'Night', from: 21, to: 5 },
]
