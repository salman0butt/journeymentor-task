import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OfferCard from '../src/components/results/OfferCard.vue'
import type { Offer } from '../src/lib/types'

const offer: Offer = {
  id: 'o1',
  price: { amount: 550.2, currency: 'GBP' },
  airline: { name: 'British Airways', iataCode: 'BA', logoUrl: null },
  slices: [],
  totalDurationMinutes: 510,
  departingAt: '2026-08-01T09:00:00',
  arrivingAt: '2026-08-01T17:30:00',
  stops: 1,
  baggage: [],
}

describe('OfferCard', () => {
  it('renders airline, times, duration, stops and price', () => {
    const w = mount(OfferCard, { props: { offer, expanded: false } })
    expect(w.text()).toContain('British Airways')
    expect(w.text()).toContain('09:00')
    expect(w.text()).toContain('17:30')
    expect(w.text()).toContain('8h 30m')
    expect(w.text()).toContain('1 stop')
    expect(w.text()).toContain('£550.20')
  })

  it('emits toggle when the details button is clicked', async () => {
    const w = mount(OfferCard, { props: { offer, expanded: false } })
    await w.find('button').trigger('click')
    expect(w.emitted('toggle')).toBeTruthy()
  })
})
