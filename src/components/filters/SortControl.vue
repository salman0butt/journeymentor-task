<script setup lang="ts">
import { useFiltersStore } from '../../stores/filters'
import type { SortKey } from '../../lib/types'
const filters = useFiltersStore()
const options: { value: SortKey; label: string }[] = [
  { value: 'price', label: 'Price (low → high)' },
  { value: 'duration', label: 'Duration (short → long)' },
  { value: 'departure', label: 'Departure (early → late)' },
]
</script>

<template>
  <label class="flex items-center gap-2 text-sm">
    <span class="text-slate-600">Sort by</span>
    <select
      :value="filters.sortKey"
      class="rounded-lg border border-slate-300 px-2 py-1.5"
      @change="filters.sortKey = ($event.target as HTMLSelectElement).value as SortKey"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </label>
</template>
