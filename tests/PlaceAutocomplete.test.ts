import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PlaceAutocomplete from '../src/components/search/PlaceAutocomplete.vue'

vi.mock('../src/composables/usePlacesQuery', () => ({ usePlacesQuery: vi.fn() }))
import { usePlacesQuery } from '../src/composables/usePlacesQuery'
import type { Place } from '../src/lib/types'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PlaceAutocomplete', () => {
  it('emits the typed value uppercased as a free-text fallback, without selecting a suggestion', async () => {
    ;(usePlacesQuery as any).mockReturnValue({ data: ref([]) })

    const w = mount(PlaceAutocomplete, { props: { modelValue: '', label: 'From' } })
    const input = w.find('input')
    await input.setValue('lhr')

    const e = w.emitted('update:modelValue')
    expect(e![e!.length - 1]).toEqual(['LHR'])
    expect(w.find('li').exists()).toBe(false)
  })

  it('opens the dropdown with suggestions and emits the IATA code on select', async () => {
    const place: Place = { type: 'airport', name: 'Heathrow', iataCode: 'LHR', cityName: 'London' }
    ;(usePlacesQuery as any).mockReturnValue({ data: ref([place]) })

    const w = mount(PlaceAutocomplete, { props: { modelValue: '', label: 'From' } })
    await w.find('input').setValue('lon')

    const item = w.find('li')
    expect(item.exists()).toBe(true)

    await item.trigger('mousedown')
    const e = w.emitted('update:modelValue')
    expect(e![e!.length - 1]).toEqual(['LHR'])
    expect(w.find('ul').exists()).toBe(false)
  })
})
