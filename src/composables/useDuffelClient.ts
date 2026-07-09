import { toOfferRequestBody, mapOffers, mapPlace } from '../lib/mappers'
import type { SearchCriteria, Offer, Place } from '../lib/types'

export function useDuffelClient() {
  async function search(c: SearchCriteria, signal?: AbortSignal): Promise<Offer[]> {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toOfferRequestBody(c)),
      signal,
    })
    if (!res.ok) throw new Error(`Search failed (${res.status})`)
    const json = await res.json()
    return mapOffers(json?.data?.offers ?? [])
  }

  async function places(query: string, signal?: AbortSignal): Promise<Place[]> {
    const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`, { signal })
    if (!res.ok) throw new Error(`Places failed (${res.status})`)
    const json = await res.json()
    return (json?.data ?? []).map(mapPlace)
  }

  return { search, places }
}
