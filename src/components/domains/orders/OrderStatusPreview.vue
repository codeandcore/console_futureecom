<template>
  <div>
    <div class="d-flex flex-gap-8 flex-wrap">
      <v-chip v-if="!value.customer.customer_id" small>
        <v-icon>fiber_manual_record</v-icon>
        <span class="mx-2">{{ $t('Guest') }}</span>
      </v-chip>
      <order-status-chip :value="value.status">
        <v-icon small>fiber_manual_record</v-icon>
        <span class="mx-2 uppercase-first-letter">{{ formatCodeToHumanText(value.status) }}</span>
      </order-status-chip>
    </div>
    <div class="text-body-2 d-flex flex-column flex-gap-8">
      <span>{{ $t('Created At') }}: {{ $format.timezone.getFormattedTime(value.created_at) }}</span>
      <span>{{ $t('Updated At') }}: {{ $format.timezone.getFormattedTime(value.updated_at) }}</span>
      <span v-if="value.resolved_at">{{ $t('Resolved At') }}: {{ value.resolved_at }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { formatCodeToHumanText } from '@/libs/domains/report/formatters'
import OrderStatusChip from '@/components/domains/orders/OrderStatusChip.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'OrderStatusPreview',

  components: { OrderStatusChip },

  props: {
    value: {
      type: Object as () => Order,
      required: true
    }
  },

  setup() {
    return {
      formatCodeToHumanText
    }
  }
})
</script>
