<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePlacesQuery } from '../composables/usePlacesQuery'
import type { Place } from '../lib/types'

const props = defineProps<{
  modelValue: string
  label: string
  placeholder?: string
  error?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const query = ref(props.modelValue) // the text in the field / the search term
const { data } = usePlacesQuery(query)
const suggestions = computed<Place[]>(() => data.value ?? [])
const open = ref(false)
let lastEmitted = props.modelValue

function onInput(value: string) {
  query.value = value // usePlacesQuery debounces this internally
  const code = value.trim().toUpperCase()
  lastEmitted = code
  emit('update:modelValue', code)
  open.value = value.trim().length >= 2
}

function select(place: Place) {
  lastEmitted = place.iataCode
  emit('update:modelValue', place.iataCode)
  query.value = `${place.cityName ?? place.name} (${place.iataCode})`
  open.value = false
}

watch(
  () => props.modelValue,
  (v) => {
    if (v !== lastEmitted) {
      query.value = v
      lastEmitted = v
    }
  },
)
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <span class="text-sm font-medium text-slate-700">{{ label }}</span>
    <input
      :value="query"
      :placeholder="placeholder"
      class="rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      @input="onInput(($event.target as HTMLInputElement).value)"
      @focus="open = suggestions.length > 0"
    />
    <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
    <ul
      v-if="open && suggestions.length"
      class="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
    >
      <li
        v-for="p in suggestions"
        :key="p.iataCode"
        class="cursor-pointer px-3 py-2 text-sm hover:bg-sky-50"
        @mousedown.prevent="select(p)"
      >
        <span class="font-medium">{{ p.iataCode }}</span> — {{ p.name }}
        <span v-if="p.cityName" class="text-slate-500">, {{ p.cityName }}</span>
      </li>
    </ul>
  </div>
</template>
