<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from '../stores/search'
import { useFiltersStore } from '../stores/filters'
import { priceBounds, airlineOptions } from '../lib/filterSort'

const search = useSearchStore()
const filters = useFiltersStore()

const bounds = computed(() => priceBounds(search.offers))
const airlines = computed(() => airlineOptions(search.offers))
const stopOptions: { value: 0 | 1 | 2; label: string }[] = [
  { value: 0, label: 'Nonstop' },
  { value: 1, label: '1 stop' },
  { value: 2, label: '2+ stops' },
]

function toggleStop(v: 0 | 1 | 2) {
  filters.stops = filters.stops.includes(v)
    ? filters.stops.filter((s) => s !== v)
    : [...filters.stops, v]
}
function toggleAirline(code: string) {
  filters.airlines = filters.airlines.includes(code)
    ? filters.airlines.filter((a) => a !== code)
    : [...filters.airlines, code]
}
const maxPrice = computed({
  get: () => filters.priceRange?.[1] ?? bounds.value[1],
  set: (v: number) => (filters.priceRange = [bounds.value[0], Number(v)]),
})
</script>

<template>
  <div class="space-y-6 rounded-xl border border-slate-200 bg-white p-4">
    <div>
      <h3 class="mb-2 text-sm font-semibold">Stops</h3>
      <label v-for="o in stopOptions" :key="o.value" class="flex items-center gap-2 py-0.5 text-sm">
        <input
          type="checkbox"
          :checked="filters.stops.includes(o.value)"
          @change="toggleStop(o.value)"
        />
        {{ o.label }}
      </label>
    </div>
    <div>
      <h3 class="mb-2 text-sm font-semibold">Max price: {{ maxPrice }}</h3>
      <input
        type="range"
        class="w-full"
        :min="bounds[0]"
        :max="bounds[1]"
        :value="maxPrice"
        @input="maxPrice = Number(($event.target as HTMLInputElement).value)"
      />
    </div>
    <div v-if="airlines.length">
      <h3 class="mb-2 text-sm font-semibold">Airlines</h3>
      <label v-for="a in airlines" :key="a.iataCode" class="flex items-center gap-2 py-0.5 text-sm">
        <input
          type="checkbox"
          :checked="filters.airlines.includes(a.iataCode)"
          @change="toggleAirline(a.iataCode)"
        />
        {{ a.name }}
      </label>
    </div>
    <button class="text-sm text-sky-600 hover:underline" @click="filters.resetFilters()">
      Clear filters
    </button>
  </div>
</template>
