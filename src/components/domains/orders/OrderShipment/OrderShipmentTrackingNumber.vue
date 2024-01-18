<template>
  <v-text-field v-bind="$attrs" v-model="trackingNumber" hide-details="auto" outlined :label="$t('Tracking number')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentTrackingNumber',

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const trackingNumber = computed({
      get: () => props.value.tracking_number,
      set: (tracking_number) => emit('input', { ...props.value, tracking_number })
    })

    return {
      trackingNumber
    }
  }
})
</script>
