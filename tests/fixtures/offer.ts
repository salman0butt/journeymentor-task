export const rawOffer = {
  id: 'off_123',
  total_amount: '550.20',
  total_currency: 'GBP',
  owner: { name: 'British Airways', iata_code: 'BA', logo_symbol_url: 'https://logo/ba.svg' },
  slices: [
    {
      origin: { iata_code: 'LHR' },
      destination: { iata_code: 'JFK' },
      duration: 'PT11H0M',
      segments: [
        {
          origin: { iata_code: 'LHR' },
          destination: { iata_code: 'DUB' },
          departing_at: '2026-08-01T09:00:00',
          arriving_at: '2026-08-01T10:30:00',
          duration: 'PT1H30M',
          marketing_carrier: { name: 'British Airways', iata_code: 'BA' },
          marketing_carrier_flight_number: '822',
          aircraft: { name: 'Airbus A320' },
          passengers: [
            {
              baggages: [
                { type: 'carry_on', quantity: 1 },
                { type: 'checked', quantity: 0 },
              ],
            },
          ],
        },
        {
          origin: { iata_code: 'DUB' },
          destination: { iata_code: 'JFK' },
          departing_at: '2026-08-01T12:00:00',
          arriving_at: '2026-08-01T20:00:00',
          duration: 'PT8H0M',
          marketing_carrier: { name: 'British Airways', iata_code: 'BA' },
          marketing_carrier_flight_number: '175',
          aircraft: { name: 'Boeing 777' },
          passengers: [{ baggages: [{ type: 'carry_on', quantity: 1 }] }],
        },
      ],
    },
  ],
}
