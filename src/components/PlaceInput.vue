<script setup lang="ts">
defineProps<{ modelValue: string; label: string; placeholder?: string; error?: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="flex flex-col gap-1">
    <span class="text-sm font-medium text-slate-700">{{ label }}</span>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      maxlength="3"
      class="rounded-lg border border-slate-300 px-3 py-2 uppercase focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value.toUpperCase())"
    />
    <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
  </label>
</template>
