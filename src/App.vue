<script setup lang="ts">
import SearchForm from './components/SearchForm.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import DateWindow from './components/DateWindow.vue'
import SearchHistory from './components/SearchHistory.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-4">
        <h1 class="text-xl font-semibold">Flight Search</h1>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-6">
      <SearchForm />
      <SearchHistory class="mt-4" />
      <DateWindow class="mt-4" />
      <ResultsPanel class="mt-6" />
    </main>
  </div>
</template>
