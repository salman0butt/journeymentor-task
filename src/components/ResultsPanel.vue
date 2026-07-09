<script setup lang="ts">
import { useSearchStore } from '../stores/search'
import { useFiltersStore } from '../stores/filters'
import LoadingState from './states/LoadingState.vue'
import EmptyState from './states/EmptyState.vue'
import ErrorState from './states/ErrorState.vue'
import ResultsList from './ResultsList.vue'
import FiltersPanel from './FiltersPanel.vue'
import SortControl from './SortControl.vue'

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
    <div v-else-if="search.status === 'success'" class="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr]">
      <aside>
        <FiltersPanel />
      </aside>
      <div>
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm text-slate-500">{{ filters.visibleOffers.length }} flights</p>
          <SortControl />
        </div>
        <ResultsList :offers="filters.visibleOffers" />
      </div>
    </div>
    <p v-else class="text-center text-slate-500">Search for flights to see results.</p>
  </section>
</template>
