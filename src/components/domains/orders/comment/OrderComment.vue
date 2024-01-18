<template>
  <div>
    <span class="text-caption">{{ $format.timezone.getFormattedTime(value.created_at) }}</span>
    <span class="text-caption">{{ value.created_by }}</span>
    <span>{{ value.text }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { OrderComment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderComment',

  props: {
    value: {
      type: Object as PropType<OrderComment>,
      required: true
    }
  }
})
</script>
