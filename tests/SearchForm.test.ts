import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('../src/composables/usePlacesQuery', () => ({
  usePlacesQuery: vi.fn(() => ({ data: ref([]) })),
}))
import SearchForm from '../src/components/search/SearchForm.vue'
import PlaceAutocomplete from '../src/components/search/PlaceAutocomplete.vue'
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
    places[0].vm.$emit('update:modelValue', 'LHR')
    places[1].vm.$emit('update:modelValue', 'JFK')
    await wrapper.vm.$nextTick()
    await wrapper.find('form').trigger('submit.prevent')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ origin: 'LHR', destination: 'JFK' }))
  })
})
