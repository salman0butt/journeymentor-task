<script setup lang="ts">
import { useSearchStore } from '../stores/search'
import { useFiltersStore } from '../stores/filters'
import LoadingState from './states/LoadingState.vue'
import EmptyState from './states/EmptyState.vue'
import ErrorState from './states/ErrorState.vue'
import ResultsList from './ResultsList.vue'

const search = useSearchStore()
const filters = useFiltersStore()

function retry() {
  if (search.criteria) search.search(search.criteria)
}
</script>

<template>
  <section>
    <LoadingState v-if="search.status === 'loading'" />
    <ErrorState v-else-if="search.status === 'error'" :message="search.error ?? 'Search failed'" @retry="retry" />
    <EmptyState v-else-if="search.status === 'empty'" />
    <ResultsList v-else-if="search.status === 'success'" :offers="filters.visibleOffers" />
    <p v-else class="text-center text-slate-500">Search for flights to see results.</p>
  </section>
</template>
