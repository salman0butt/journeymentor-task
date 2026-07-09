import { toOfferRequestBody, mapOffers, mapPlace } from '../lib/mappers'
import { offerSearchResponseSchema, placesResponseSchema } from '../lib/schemas'
import type { SearchCriteria, Offer, Place } from '../lib/types'

export async function searchOffers(
  criteria: SearchCriteria,
  signal?: AbortSignal,
): Promise<Offer[]> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toOfferRequestBody(criteria)),
    signal,
  })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  const json = await res.json()
  const parsed = offerSearchResponseSchema.parse(json)
  return mapOffers(parsed.data.offers)
}

export async function getPlaceSuggestions(query: string, signal?: AbortSignal): Promise<Place[]> {
  const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`, { signal })
  if (!res.ok) throw new Error(`Places failed (${res.status})`)
  const json = await res.json()
  const parsed = placesResponseSchema.parse(json)
  return parsed.data.map(mapPlace)
}
