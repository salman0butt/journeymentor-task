<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from '../../stores/search'
import { dayWindow, formatDayLabel } from '../../lib/format'

const search = useSearchStore()
const days = computed(() => (search.criteria ? dayWindow(search.criteria.departureDate, 3) : []))
</script>

<template>
  <div v-if="days.length" class="flex gap-2 overflow-x-auto pb-1">
    <button
      v-for="day in days"
      :key="day"
      type="button"
      class="shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-sm"
      :class="
        day === search.criteria?.departureDate
          ? 'border-sky-600 bg-sky-50 font-semibold text-sky-700'
          : 'border-slate-300 hover:border-slate-400'
      "
      @click="search.shiftDateTo(day)"
    >
      {{ formatDayLabel(day) }}
    </button>
  </div>
</template>
