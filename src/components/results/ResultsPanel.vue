<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useSearchStore } from '../../stores/search'
import { useOffersQuery } from '../../composables/useOffersQuery'
import { useVisibleOffers } from '../../composables/useVisibleOffers'
import LoadingState from '../states/LoadingState.vue'
import EmptyState from '../states/EmptyState.vue'
import ErrorState from '../states/ErrorState.vue'
import ResultsList from './ResultsList.vue'
import FiltersPanel from '../filters/FiltersPanel.vue'
import SortControl from '../filters/SortControl.vue'

const search = useSearchStore()
const query = useOffersQuery(toRef(search, 'criteria'))

const offers = computed(() => query.data.value ?? [])
const { visibleOffers } = useVisibleOffers(offers)

function retry() {
  query.refetch()
}
</script>

<template>
  <section>
    <p v-if="search.criteria == null" class="text-center text-slate-500">
      Search for flights to see results.
    </p>
    <ErrorState
      v-else-if="query.isError.value"
      :message="(query.error.value as Error)?.message ?? 'Search failed'"
      @retry="retry"
    />
    <LoadingState v-else-if="query.isLoading.value" />
    <EmptyState v-else-if="offers.length === 0" />
    <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr]">
      <aside>
        <details class="lg:hidden">
          <summary
            class="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
          >
            Filters
          </summary>
          <div class="mt-2"><FiltersPanel :offers="offers" /></div>
        </details>
        <div class="hidden lg:block"><FiltersPanel :offers="offers" /></div>
      </aside>
      <div>
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm text-slate-500">{{ visibleOffers.length }} flights</p>
          <SortControl />
        </div>
        <ResultsList :offers="visibleOffers" />
      </div>
    </div>
  </section>
</template>
