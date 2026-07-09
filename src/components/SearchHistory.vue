<script setup lang="ts">
import { useHistoryStore } from '../stores/history'
import { useSearchStore } from '../stores/search'
import { useFiltersStore } from '../stores/filters'
import type { HistoryEntry } from '../stores/history'

const history = useHistoryStore()
const search = useSearchStore()
const filters = useFiltersStore()

function replay(entry: HistoryEntry) {
  filters.resetFilters()
  search.setCriteria({ ...entry.criteria })
}
</script>

<template>
  <div v-if="history.entries.length" class="flex flex-wrap items-center gap-2">
    <span class="text-sm text-slate-500">Recent:</span>
    <button
      v-for="(entry, index) in history.entries"
      :key="index"
      type="button"
      class="rounded-full border border-slate-300 px-3 py-1 text-xs hover:border-sky-400 hover:text-sky-700"
      @click="replay(entry)"
    >
      {{ entry.label }}
    </button>
    <button type="button" class="text-xs text-slate-400 hover:underline" @click="history.clear()">
      Clear
    </button>
  </div>
</template>
