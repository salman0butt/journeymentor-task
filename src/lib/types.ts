export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'
export interface SearchCriteria {
  origin: string
  destination: string
  departureDate: string // YYYY-MM-DD
  returnDate: string | null
  passengers: number
  cabin: CabinClass
}
export interface Money {
  amount: number
  currency: string
}
export interface Airline {
  name: string
  iataCode: string
  logoUrl: string | null
}
export interface Baggage {
  type: string
  quantity: number
}
export interface Segment {
  origin: string
  destination: string
  departingAt: string
  arrivingAt: string
  durationMinutes: number
  marketingCarrier: string
  flightNumber: string
  aircraft: string | null
  layoverAfterMinutes: number | null
}
export interface NormalizedSlice {
  origin: string
  destination: string
  durationMinutes: number
  stops: number
  segments: Segment[]
}
export interface Offer {
  id: string
  price: Money
  airline: Airline
  slices: NormalizedSlice[]
  totalDurationMinutes: number
  departingAt: string
  arrivingAt: string
  stops: number
  baggage: Baggage[]
}
export interface Place {
  type: string
  name: string
  iataCode: string
  cityName: string | null
}
export type SortKey = 'price' | 'duration' | 'departure'
