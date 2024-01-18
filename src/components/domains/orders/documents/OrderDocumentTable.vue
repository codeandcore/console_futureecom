<template>
  <v-data-table :items="value.documents" :headers="headers" hide-default-footer>
    <template #item.type="{ item }">
      <span class="text-capitalize">{{ item.type.replace('_', ' ') }}</span>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.actions="{ item }">
      <order-document-actions :value="item" :order-id="value.id" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import OrderDocumentActions from '@/components/domains/orders/OrderDocumentActions.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderDocumentTable',
  components: { OrderDocumentActions },

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup() {
    const headers = computed((ctx) => [
      { text: ctx.$t('Type'), value: 'type' },
      { text: ctx.$t('Number'), value: 'number' },
      { text: ctx.$t('Created At'), value: 'created_at' },
      { text: '', value: 'actions', sortable: false }
    ])

    return {
      headers
    }
  }
})
</script>
