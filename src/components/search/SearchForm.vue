<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import PlaceAutocomplete from './PlaceAutocomplete.vue'
import PassengerStepper from './PassengerStepper.vue'
import CabinSelect from './CabinSelect.vue'
import { useSearchStore } from '../../stores/search'
import { useHistoryStore } from '../../stores/history'
import { useFiltersStore } from '../../stores/filters'
import { validateCriteria, hasErrors, type ValidationErrors } from '../../lib/validation'
import type { SearchCriteria } from '../../lib/types'

const searchStore = useSearchStore()
const historyStore = useHistoryStore()
const filtersStore = useFiltersStore()

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

const form = reactive<SearchCriteria>({
  ...(searchStore.criteria ?? {
    origin: '',
    destination: '',
    departureDate: todayIso(),
    returnDate: null,
    passengers: 1,
    cabin: 'economy',
  }),
})

const errors = ref<ValidationErrors>({})
const submitted = ref(false)

const displayErrors = computed(() => (submitted.value ? errors.value : {}))

watch(
  () => searchStore.criteria,
  (c) => {
    if (c) Object.assign(form, c)
  },
)

function submit() {
  submitted.value = true
  errors.value = validateCriteria(form, todayIso())
  if (hasErrors(errors.value)) return
  const criteria: SearchCriteria = { ...form }
  historyStore.record(criteria)
  filtersStore.resetFilters()
  searchStore.setCriteria(criteria)
}
</script>

<template>
  <form class="rounded-2xl bg-white p-4 shadow-sm sm:p-6" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <PlaceAutocomplete
        v-model="form.origin"
        label="From"
        placeholder="LHR"
        :error="displayErrors.origin"
      />
      <PlaceAutocomplete
        v-model="form.destination"
        label="To"
        placeholder="JFK"
        :error="displayErrors.destination"
      />
      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-slate-700">Departure</span>
        <input
          v-model="form.departureDate"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2"
        />
        <span v-if="displayErrors.departureDate" class="text-xs text-red-600">{{
          displayErrors.departureDate
        }}</span>
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium text-slate-700">Return (optional)</span>
        <input
          :value="form.returnDate ?? ''"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2"
          @input="form.returnDate = ($event.target as HTMLInputElement).value || null"
        />
        <span v-if="displayErrors.returnDate" class="text-xs text-red-600">{{
          displayErrors.returnDate
        }}</span>
      </label>
      <PassengerStepper v-model="form.passengers" />
      <CabinSelect v-model="form.cabin" />
    </div>
    <button
      type="submit"
      class="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 sm:w-auto"
    >
      Search flights
    </button>
  </form>
</template>
