import { z } from 'zod'

export function makeCriteriaSchema(today: string) {
  return z
    .object({
      origin: z.string().min(1, 'Select an origin'),
      destination: z.string().min(1, 'Select a destination'),
      departureDate: z.string().min(1, 'Select a departure date'),
      returnDate: z.string().nullable(),
      passengers: z.number().min(1, 'At least one passenger'),
      cabin: z.enum(['economy', 'premium_economy', 'business', 'first']),
    })
    .superRefine((c, ctx) => {
      if (c.origin && c.destination && c.origin === c.destination) {
        ctx.addIssue({
          code: 'custom',
          message: 'Origin and destination must differ',
          path: ['destination'],
        })
      }
      if (c.departureDate && c.departureDate < today) {
        ctx.addIssue({
          code: 'custom',
          message: 'Departure cannot be in the past',
          path: ['departureDate'],
        })
      }
      if (c.returnDate && c.departureDate && c.returnDate < c.departureDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'Return cannot be before departure',
          path: ['returnDate'],
        })
      }
    })
}

export type CriteriaSchema = ReturnType<typeof makeCriteriaSchema>

const rawBaggageSchema = z.looseObject({
  type: z.string(),
  quantity: z.number(),
})

const rawPassengerSchema = z.looseObject({
  baggages: z.array(rawBaggageSchema).optional().nullable(),
})

const rawAirportSchema = z.looseObject({
  iata_code: z.string(),
})

const rawCarrierSchema = z.looseObject({
  name: z.string(),
  iata_code: z.string(),
})

const rawAircraftSchema = z.looseObject({
  name: z.string(),
})

const rawSegmentSchema = z.looseObject({
  origin: rawAirportSchema,
  destination: rawAirportSchema,
  departing_at: z.string(),
  arriving_at: z.string(),
  duration: z.string(),
  marketing_carrier: rawCarrierSchema.optional().nullable(),
  marketing_carrier_flight_number: z.string().optional().nullable(),
  aircraft: rawAircraftSchema.optional().nullable(),
  passengers: z.array(rawPassengerSchema).optional().nullable(),
})

const rawSliceSchema = z.looseObject({
  origin: rawAirportSchema,
  destination: rawAirportSchema,
  duration: z.string(),
  segments: z.array(rawSegmentSchema),
})

const rawOwnerSchema = z.looseObject({
  name: z.string(),
  iata_code: z.string(),
  logo_symbol_url: z.string().optional().nullable(),
})

export const rawOfferSchema = z.looseObject({
  id: z.string(),
  total_amount: z.string(),
  total_currency: z.string(),
  owner: rawOwnerSchema.optional(),
  slices: z.array(rawSliceSchema),
})

export const offerSearchResponseSchema = z.looseObject({
  data: z.looseObject({
    offers: z.array(rawOfferSchema),
  }),
})

export const rawPlaceSchema = z.looseObject({
  type: z.string(),
  name: z.string(),
  iata_code: z.string(),
  city_name: z.string().optional().nullable(),
})

export const placesResponseSchema = z.looseObject({
  data: z.array(rawPlaceSchema),
})

export type RawOffer = z.infer<typeof rawOfferSchema>
export type RawPlace = z.infer<typeof rawPlaceSchema>
export type OfferSearchResponse = z.infer<typeof offerSearchResponseSchema>
export type PlacesResponse = z.infer<typeof placesResponseSchema>
