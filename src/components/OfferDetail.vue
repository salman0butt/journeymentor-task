<script setup lang="ts">
import type { Offer } from '../lib/types'
import { formatTime, formatDuration } from '../lib/format'

defineProps<{ offer: Offer }>()
</script>

<template>
  <div class="mt-4 space-y-4 border-t border-slate-100 pt-4">
    <div v-for="(slice, si) in offer.slices" :key="si" class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {{ slice.origin }} → {{ slice.destination }} · {{ formatDuration(slice.durationMinutes) }}
      </p>
      <template v-for="(seg, i) in slice.segments" :key="i">
        <div class="flex items-start justify-between text-sm">
          <div>
            <p class="font-medium">{{ seg.origin }} → {{ seg.destination }}</p>
            <p class="text-slate-500">
              {{ seg.marketingCarrier }} {{ seg.flightNumber }} · {{ seg.aircraft ?? '' }}
            </p>
          </div>
          <div class="text-right text-slate-600">
            <p>{{ formatTime(seg.departingAt) }} – {{ formatTime(seg.arrivingAt) }}</p>
            <p>{{ formatDuration(seg.durationMinutes) }}</p>
          </div>
        </div>
        <p
          v-if="seg.layoverAfterMinutes !== null"
          class="rounded bg-amber-50 px-2 py-1 text-xs text-amber-700"
        >
          Layover in {{ seg.destination }} · {{ formatDuration(seg.layoverAfterMinutes) }}
        </p>
      </template>
    </div>
    <div v-if="offer.baggage.length" class="text-sm text-slate-600">
      <span class="font-medium">Baggage:</span>
      <span v-for="(b, i) in offer.baggage" :key="i">
        {{ b.quantity }}× {{ b.type.replaceAll('_', ' ')
        }}<span v-if="i < offer.baggage.length - 1">,</span></span
      >
    </div>
  </div>
</template>
