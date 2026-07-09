<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()
function set(n: number) {
  emit('update:modelValue', Math.max(1, Math.min(9, n)))
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="text-sm font-medium text-slate-700">Passengers</span>
    <div class="flex items-center gap-3">
      <button type="button" class="h-9 w-9 rounded-lg border border-slate-300" @click="set(props.modelValue - 1)">−</button>
      <span class="w-6 text-center">{{ props.modelValue }}</span>
      <button type="button" class="h-9 w-9 rounded-lg border border-slate-300" @click="set(props.modelValue + 1)">+</button>
    </div>
  </div>
</template>
