import type { Offer, SortKey } from './types'

export function stopsBucket(stops: number): 0 | 1 | 2 {
  return stops >= 2 ? 2 : (stops as 0 | 1)
}

export interface FilterCriteria {
  stops: Array<0 | 1 | 2>
  priceRange: [number, number] | null
  airlines: string[]
}

export function applyFilters(offers: Offer[], f: FilterCriteria): Offer[] {
  return offers.filter((o) => {
    if (f.stops.length > 0 && !f.stops.includes(stopsBucket(o.stops))) return false
    if (f.priceRange && (o.price.amount < f.priceRange[0] || o.price.amount > f.priceRange[1]))
      return false
    if (f.airlines.length > 0 && !f.airlines.includes(o.airline.iataCode)) return false
    return true
  })
}

export function sortOffers(offers: Offer[], key: SortKey): Offer[] {
  const copy = [...offers]
  copy.sort((a, b) => {
    if (key === 'price') return a.price.amount - b.price.amount
    if (key === 'duration') return a.totalDurationMinutes - b.totalDurationMinutes
    return new Date(a.departingAt).getTime() - new Date(b.departingAt).getTime()
  })
  return copy
}

export function priceBounds(offers: Offer[]): [number, number] {
  if (offers.length === 0) return [0, 0]
  const prices = offers.map((o) => o.price.amount)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}

export function airlineOptions(offers: Offer[]): { iataCode: string; name: string }[] {
  const map = new Map<string, string>()
  for (const o of offers) map.set(o.airline.iataCode, o.airline.name)
  return [...map.entries()]
    .map(([iataCode, name]) => ({ iataCode, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
