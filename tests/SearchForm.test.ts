import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('../src/composables/usePlacesQuery', () => ({
  usePlacesQuery: vi.fn(() => ({ data: ref([]) })),
}))
import SearchForm from '../src/components/SearchForm.vue'
import PlaceAutocomplete from '../src/components/PlaceAutocomplete.vue'
import { useSearchStore } from '../src/stores/search'

beforeEach(() => setActivePinia(createPinia()))

describe('SearchForm', () => {
  it('shows validation errors and does not search when invalid', async () => {
    const store = useSearchStore()
    const spy = vi.spyOn(store, 'setCriteria')
    const wrapper = mount(SearchForm)
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Select an origin')
    expect(spy).not.toHaveBeenCalled()
  })

  it('calls setCriteria when the form is valid', async () => {
    const store = useSearchStore()
    const spy = vi.spyOn(store, 'setCriteria')
    const wrapper = mount(SearchForm)
    const places = wrapper.findAllComponents(PlaceAutocomplete)
    places[0].vm.$emit('update:modelValue', 'LHR') // origin
    places[1].vm.$emit('update:modelValue', 'JFK') // destination
    await wrapper.vm.$nextTick()
    await wrapper.find('form').trigger('submit.prevent')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ origin: 'LHR', destination: 'JFK' }))
  })

  it('does not mutate store criteria when editing a seeded form', async () => {
    const store = useSearchStore()
    store.criteria = {
      origin: 'LHR',
      destination: 'JFK',
      departureDate: '2026-08-01',
      returnDate: null,
      passengers: 1,
      cabin: 'economy',
    }
    const wrapper = mount(SearchForm)
    wrapper.findAllComponents(PlaceAutocomplete)[0].vm.$emit('update:modelValue', 'MAN') // edit origin field
    await wrapper.vm.$nextTick()
    expect(store.criteria.origin).toBe('LHR') // store's canonical criteria unchanged
  })
})
