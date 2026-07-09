<script setup lang="ts">
import { ref } from 'vue'
import OfferCard from './OfferCard.vue'
import OfferDetail from './OfferDetail.vue'
import type { Offer } from '../lib/types'

defineProps<{ offers: Offer[] }>()
const expandedId = ref<string | null>(null)
function toggle(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="space-y-3">
    <OfferCard
      v-for="offer in offers"
      :key="offer.id"
      :offer="offer"
      :expanded="expandedId === offer.id"
      @toggle="toggle(offer.id)"
    >
      <template #detail>
        <OfferDetail :offer="offer" />
      </template>
    </OfferCard>
  </div>
</template>
