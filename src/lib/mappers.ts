import { parseDurationToMinutes } from './format'
import type { SearchCriteria, Offer, NormalizedSlice, Segment, Baggage, Place } from './types'

export function toOfferRequestBody(c: SearchCriteria) {
  const slices = [{ origin: c.origin, destination: c.destination, departure_date: c.departureDate }]
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

function minutesBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000)
}

function mapSegment(raw: any, next: any | undefined): Segment {
  return {
    origin: raw.origin.iata_code,
    destination: raw.destination.iata_code,
    departingAt: raw.departing_at,
    arrivingAt: raw.arriving_at,
    durationMinutes: parseDurationToMinutes(raw.duration ?? ''),
    marketingCarrier: raw.marketing_carrier?.name ?? '',
    flightNumber: raw.marketing_carrier_flight_number ?? '',
    aircraft: raw.aircraft?.name ?? null,
    layoverAfterMinutes: next ? minutesBetween(raw.arriving_at, next.departing_at) : null,
  }
}

function mapSlice(raw: any): NormalizedSlice {
  const segments: Segment[] = raw.segments.map((s: any, i: number) =>
    mapSegment(s, raw.segments[i + 1]),
  )
  return {
    origin: raw.origin.iata_code,
    destination: raw.destination.iata_code,
    durationMinutes: parseDurationToMinutes(raw.duration ?? ''),
    stops: Math.max(0, raw.segments.length - 1),
    segments,
  }
}

export function mapOffer(raw: any): Offer {
  const slices = raw.slices.map(mapSlice)
  const primary = slices[0]
  const firstSeg = primary.segments[0]
  const lastSeg = primary.segments[primary.segments.length - 1]
  const baggage: Baggage[] = (raw.slices[0].segments[0].passengers?.[0]?.baggages ?? []).map(
    (b: any) => ({ type: b.type, quantity: b.quantity }),
  )
  return {
    id: raw.id,
    price: { amount: Number(raw.total_amount), currency: raw.total_currency },
    airline: {
      name: raw.owner?.name ?? '',
      iataCode: raw.owner?.iata_code ?? '',
      logoUrl: raw.owner?.logo_symbol_url ?? null,
    },
    slices,
    totalDurationMinutes: slices.reduce(
      (sum: number, s: NormalizedSlice) => sum + s.durationMinutes,
      0,
    ),
    departingAt: firstSeg.departingAt,
    arrivingAt: lastSeg.arrivingAt,
    stops: primary.stops,
    baggage,
  }
}

export function mapOffers(raw: any[]): Offer[] {
  return (raw ?? []).map(mapOffer)
}

export function mapPlace(raw: any): Place {
  return {
    type: raw.type,
    name: raw.name,
    iataCode: raw.iata_code,
    cityName: raw.city_name ?? null,
  }
}
