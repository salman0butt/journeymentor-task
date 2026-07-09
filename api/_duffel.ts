const DUFFEL_BASE = 'https://api.duffel.com'
const DUFFEL_VERSION = 'v2'

export function duffelHeaders(): Record<string, string> {
  const token = process.env.DUFFEL_TOKEN
  if (!token) throw new Error('DUFFEL_TOKEN is not set')
  return {
    Authorization: `Bearer ${token}`,
    'Duffel-Version': DUFFEL_VERSION,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}

export async function searchOffers(
  body: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<{ status: number; payload: unknown }> {
  const res = await fetchImpl(`${DUFFEL_BASE}/air/offer_requests?return_offers=true`, {
    method: 'POST',
    headers: duffelHeaders(),
    body: JSON.stringify(body),
  })
  return { status: res.status, payload: await res.json() }
}

export async function placeSuggestions(
  query: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ status: number; payload: unknown }> {
  const res = await fetchImpl(
    `${DUFFEL_BASE}/places/suggestions?query=${encodeURIComponent(query)}`,
    { headers: duffelHeaders() },
  )
  return { status: res.status, payload: await res.json() }
}
