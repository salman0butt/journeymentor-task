import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SearchCriteria } from '../lib/types'

export interface HistoryEntry {
  criteria: SearchCriteria
  label: string
}

const MAX_ENTRIES = 8

function labelFor(c: SearchCriteria): string {
  const trip = c.returnDate ? `${c.departureDate} – ${c.returnDate}` : c.departureDate
  return `${c.origin} → ${c.destination} · ${trip} · ${c.passengers}p`
}

export const useHistoryStore = defineStore(
  'history',
  () => {
    const entries = ref<HistoryEntry[]>([])

    function record(c: SearchCriteria) {
      const label = labelFor(c)
      if (entries.value[0]?.label === label) return
      entries.value.unshift({ criteria: { ...c }, label })
      if (entries.value.length > MAX_ENTRIES) entries.value.length = MAX_ENTRIES
    }

    function clear() {
      entries.value = []
    }

    return { entries, record, clear }
  },
  { persist: true },
)
