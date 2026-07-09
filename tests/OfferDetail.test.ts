import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OfferDetail from '../src/components/results/OfferDetail.vue'
import type { Offer } from '../src/lib/types'

const offer: Offer = {
  id: 'o1',
  price: { amount: 1, currency: 'GBP' },
  airline: { name: 'BA', iataCode: 'BA', logoUrl: null },
  slices: [
    {
      origin: 'LHR',
      destination: 'JFK',
      durationMinutes: 660,
      stops: 1,
      segments: [
        {
          origin: 'LHR',
          destination: 'DUB',
          departingAt: '2026-08-01T09:00:00',
          arrivingAt: '2026-08-01T10:30:00',
          durationMinutes: 90,
          marketingCarrier: 'BA',
          flightNumber: '822',
          aircraft: 'A320',
          layoverAfterMinutes: 90,
        },
        {
          origin: 'DUB',
          destination: 'JFK',
          departingAt: '2026-08-01T12:00:00',
          arrivingAt: '2026-08-01T20:00:00',
          durationMinutes: 480,
          marketingCarrier: 'BA',
          flightNumber: '175',
          aircraft: 'B777',
          layoverAfterMinutes: null,
        },
      ],
    },
  ],
  totalDurationMinutes: 660,
  departingAt: '2026-08-01T09:00:00',
  arrivingAt: '2026-08-01T20:00:00',
  stops: 1,
  baggage: [{ type: 'carry_on', quantity: 1 }],
}

describe('OfferDetail', () => {
  it('renders segments, a layover and baggage', () => {
    const w = mount(OfferDetail, { props: { offer } })
    expect(w.text()).toContain('LHR → DUB')
    expect(w.text()).toContain('DUB → JFK')
    expect(w.text()).toContain('Layover in DUB')
    expect(w.text()).toContain('1× carry on')
  })
})
