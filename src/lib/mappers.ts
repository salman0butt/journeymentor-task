import type { SearchCriteria } from './types'

export function toOfferRequestBody(c: SearchCriteria) {
  const slices = [
    { origin: c.origin, destination: c.destination, departure_date: c.departureDate },
  ]
  if (c.returnDate) {
    slices.push({ origin: c.destination, destination: c.origin, departure_date: c.returnDate })
  }
  return {
    data: {
      slices,
      passengers: Array.from({ length: c.passengers }, () => ({ type: 'adult' as const })),
      cabin_class: c.cabin,
    },
  }
}
