<script setup lang="ts">
import type { CabinClass } from '../../lib/types'
import { CABIN_OPTIONS } from '../../lib/constants'
defineProps<{ modelValue: CabinClass }>()
defineEmits<{ 'update:modelValue': [CabinClass] }>()
</script>

<template>
  <label class="flex flex-col gap-1">
    <span class="text-sm font-medium text-slate-700">Cabin</span>
    <select
      :value="modelValue"
      class="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as CabinClass)"
    >
      <option v-for="o in CABIN_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </label>
</template>
