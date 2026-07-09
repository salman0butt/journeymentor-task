<script setup lang="ts">
import type { CabinClass } from '../lib/types'
defineProps<{ modelValue: CabinClass }>()
defineEmits<{ 'update:modelValue': [CabinClass] }>()
const options: { value: CabinClass; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]
</script>

<template>
  <label class="flex flex-col gap-1">
    <span class="text-sm font-medium text-slate-700">Cabin</span>
    <select
      :value="modelValue"
      class="rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as CabinClass)"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </label>
</template>
