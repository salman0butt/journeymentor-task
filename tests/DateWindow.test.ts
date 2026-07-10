import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import DateWindow from '../src/components/search/DateWindow.vue'
import { useSearchStore } from '../src/stores/search'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-10T12:00:00Z'))
  setActivePinia(createPinia())
})

afterEach(() => vi.useRealTimers())

describe('DateWindow', () => {
  it('renders 7 days and shifts on click', async () => {
    const store = useSearchStore()
    store.criteria = {
      origin: 'LHR',
      destination: 'JFK',
      departureDate: '2026-08-01',
      returnDate: null,
      passengers: 1,
      cabin: 'economy',
    }
    const spy = vi.spyOn(store, 'shiftDateTo').mockImplementation(() => {})
    const w = mount(DateWindow)
    const buttons = w.findAll('button')
    expect(buttons).toHaveLength(7)
    await buttons[0].trigger('click')
    expect(spy).toHaveBeenCalledWith('2026-07-29')
  })

  it('does not offer past departure dates', () => {
    const store = useSearchStore()
    store.criteria = {
      origin: 'LHR',
      destination: 'JFK',
      departureDate: '2026-07-10',
      returnDate: null,
      passengers: 1,
      cabin: 'economy',
    }

    const wrapper = mount(DateWindow)

    expect(wrapper.findAll('button')).toHaveLength(4)
    expect(wrapper.text()).not.toContain('Thu 9 Jul')
  })
})
