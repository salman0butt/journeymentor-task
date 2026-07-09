<script setup lang="ts">
import { ref } from 'vue'
import { useDuffelClient } from '../composables/useDuffelClient'
import { useDebounce } from '../composables/useDebounce'
import type { Place } from '../lib/types'

const props = defineProps<{ modelValue: string; label: string; placeholder?: string; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const client = useDuffelClient()
const query = ref(props.modelValue)
const suggestions = ref<Place[]>([])
const open = ref(false)
let controller: AbortController | null = null

const fetchSuggestions = useDebounce(async (q: string) => {
  controller?.abort()
  controller = new AbortController()
  try {
    suggestions.value = await client.places(q, controller.signal)
    open.value = suggestions.value.length > 0
  } catch {
    // aborted or failed — leave list as-is
  }
}, 300)

function onInput(value: string) {
  query.value = value
  if (value.trim().length >= 2) fetchSuggestions(value.trim())
  else {
    suggestions.value = []
    open.value = false
  }
}

function select(place: Place) {
  emit('update:modelValue', place.iataCode)
  query.value = `${place.cityName ?? place.name} (${place.iataCode})`
  open.value = false
}
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
      v-if="open"
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
