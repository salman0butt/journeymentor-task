<script setup lang="ts">
import type { Offer } from '../lib/types'
import { formatTime, formatDuration, formatPrice } from '../lib/format'

defineProps<{ offer: Offer; expanded: boolean }>()
defineEmits<{ toggle: [] }>()

function stopsLabel(stops: number): string {
  if (stops === 0) return 'Nonstop'
  return `${stops} stop${stops > 1 ? 's' : ''}`
}
</script>

<template>
  <article class="rounded-xl border border-slate-200 bg-white p-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <img
          v-if="offer.airline.logoUrl"
          :src="offer.airline.logoUrl"
          :alt="offer.airline.name"
          class="h-8 w-8"
        />
        <div>
          <p class="font-medium">{{ offer.airline.name }}</p>
          <p class="text-sm text-slate-500">
            {{ formatTime(offer.departingAt) }} → {{ formatTime(offer.arrivingAt) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-6 text-sm text-slate-600">
        <span>{{ formatDuration(offer.totalDurationMinutes) }}</span>
        <span>{{ stopsLabel(offer.stops) }}</span>
        <span class="text-lg font-semibold text-slate-900">{{ formatPrice(offer.price) }}</span>
      </div>
    </div>
    <button
      type="button"
      class="mt-3 text-sm font-medium text-sky-600 hover:underline"
      @click="$emit('toggle')"
    >
      {{ expanded ? 'Hide details' : 'View details' }}
    </button>
    <slot v-if="expanded" name="detail" />
  </article>
</template>
