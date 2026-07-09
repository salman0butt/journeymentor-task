import type { SearchCriteria } from './types'

export interface ValidationErrors {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  passengers?: string
}

export function validateCriteria(c: SearchCriteria, today: string): ValidationErrors {
  const e: ValidationErrors = {}
  if (!c.origin) e.origin = 'Select an origin'
  if (!c.destination) e.destination = 'Select a destination'
  if (c.origin && c.destination && c.origin === c.destination) {
    e.destination = 'Origin and destination must differ'
  }
  if (!c.departureDate) e.departureDate = 'Select a departure date'
  else if (c.departureDate < today) e.departureDate = 'Departure cannot be in the past'
  if (c.returnDate && c.departureDate && c.returnDate < c.departureDate) {
    e.returnDate = 'Return cannot be before departure'
  }
  if (c.passengers < 1) e.passengers = 'At least one passenger'
  return e
}

export function hasErrors(e: ValidationErrors): boolean {
  return Object.keys(e).length > 0
}
