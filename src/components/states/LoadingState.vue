<script setup lang="ts"></script>
<template>
  <div class="space-y-3" aria-busy="true">
    <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-xl bg-slate-200"></div>
  </div>
</template>
