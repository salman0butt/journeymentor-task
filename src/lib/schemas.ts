import { z } from 'zod'

// ---------------------------------------------------------------------------
// Form-criteria validation
//
// Mirrors src/lib/validation.ts exactly (same rules, same error message
// strings) so swapping the imperative validator for this schema later is a
// behavior-preserving change. Cross-field rules (origin !== destination,
// departureDate >= today, returnDate >= departureDate) are expressed with
// `.superRefine` so each issue can be attached to the right field path.
// ---------------------------------------------------------------------------

export function makeCriteriaSchema(today: string) {
  return z
    .object({
      origin: z.string().min(1, 'Select an origin'),
      destination: z.string().min(1, 'Select a destination'),
      departureDate: z.string().min(1, 'Select a departure date'),
      returnDate: z.string().nullable(),
      passengers: z.number().int().min(1, 'At least one passenger'),
      cabin: z.enum(['economy', 'premium_economy', 'business', 'first']),
    })
    .superRefine((c, ctx) => {
      if (c.origin && c.destination && c.origin === c.destination) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Origin and destination must differ',
          path: ['destination'],
        })
      }
      if (c.departureDate && c.departureDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Departure cannot be in the past',
          path: ['departureDate'],
        })
      }
      if (c.returnDate && c.departureDate && c.returnDate < c.departureDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Return cannot be before departure',
          path: ['returnDate'],
        })
      }
    })
}

export type CriteriaSchema = ReturnType<typeof makeCriteriaSchema>

// ---------------------------------------------------------------------------
// Duffel response schemas
//
// These validate ONLY the fields our mappers (src/lib/mappers.ts) actually
// read. They are intentionally lenient:
//  - fields the mappers guard with `?.` / `??` are `.optional()`/`.nullable()`
//    here too (logo_symbol_url, aircraft, passengers, baggages, city_name,
//    marketing_carrier_flight_number).
//  - every nested object uses `.passthrough()` so additional fields Duffel
//    sends (and that we don't care about) don't fail parsing.
// This keeps parsing resilient to the real sandbox response growing new
// fields, while still catching genuinely malformed shapes.
// ---------------------------------------------------------------------------

const rawBaggageSchema = z
  .object({
    type: z.string(),
    quantity: z.number(),
  })
  .passthrough()

const rawPassengerSchema = z
  .object({
    baggages: z.array(rawBaggageSchema).optional(),
  })
  .passthrough()

const rawAirportSchema = z
  .object({
    iata_code: z.string(),
  })
  .passthrough()

const rawCarrierSchema = z
  .object({
    name: z.string(),
    iata_code: z.string(),
  })
  .passthrough()

const rawAircraftSchema = z
  .object({
    name: z.string(),
  })
  .passthrough()

const rawSegmentSchema = z
  .object({
    origin: rawAirportSchema,
    destination: rawAirportSchema,
    departing_at: z.string(),
    arriving_at: z.string(),
    duration: z.string(),
    marketing_carrier: rawCarrierSchema.optional(),
    marketing_carrier_flight_number: z.string().optional().nullable(),
    aircraft: rawAircraftSchema.optional().nullable(),
    passengers: z.array(rawPassengerSchema).optional(),
  })
  .passthrough()

const rawSliceSchema = z
  .object({
    origin: rawAirportSchema,
    destination: rawAirportSchema,
    duration: z.string(),
    segments: z.array(rawSegmentSchema),
  })
  .passthrough()

const rawOwnerSchema = z
  .object({
    name: z.string(),
    iata_code: z.string(),
    logo_symbol_url: z.string().optional().nullable(),
  })
  .passthrough()

export const rawOfferSchema = z
  .object({
    id: z.string(),
    total_amount: z.string(),
    total_currency: z.string(),
    owner: rawOwnerSchema,
    slices: z.array(rawSliceSchema),
  })
  .passthrough()

export const offerSearchResponseSchema = z
  .object({
    data: z
      .object({
        offers: z.array(rawOfferSchema),
      })
      .passthrough(),
  })
  .passthrough()

export const rawPlaceSchema = z
  .object({
    type: z.string(),
    name: z.string(),
    iata_code: z.string(),
    city_name: z.string().optional().nullable(),
  })
  .passthrough()

export const placesResponseSchema = z
  .object({
    data: z.array(rawPlaceSchema),
  })
  .passthrough()

export type RawOffer = z.infer<typeof rawOfferSchema>
export type RawPlace = z.infer<typeof rawPlaceSchema>
export type OfferSearchResponse = z.infer<typeof offerSearchResponseSchema>
export type PlacesResponse = z.infer<typeof placesResponseSchema>
