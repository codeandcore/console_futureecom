<template>
  <div>
    <div class="d-flex text-caption align-center flex-gap-8">
      <v-icon v-if="value.resolved_at" color="green">check</v-icon>
      <v-icon v-else color="error">close</v-icon>

      <div class="d-flex flex-column">
        <span>{{ $t('Created By') }}: {{ value.created_by }}</span>
        <span v-if="value.resolved_at">
          {{ $t('Resolved At') }}: {{ $format.timezone.getFormattedTime(value.resolved_at) }}
        </span>
      </div>
    </div>
    <span>{{ value.reason }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { OrderHoldReason } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderHoldReason',

  props: {
    value: {
      type: Object as PropType<OrderHoldReason>,
      required: true
    }
  }
})
</script>
