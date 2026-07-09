<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div class="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
    <p class="text-red-700">{{ message }}</p>
    <button
      type="button"
      class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
      @click="$emit('retry')"
    >
      Retry
    </button>
  </div>
</template>
