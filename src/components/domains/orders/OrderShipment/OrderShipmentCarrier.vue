<template>
  <v-text-field v-bind="$attrs" v-model="carrier" hide-details="auto" outlined :label="$t('Carrier')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentCarrier',

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const carrier = computed({
      get: () => props.value.carrier,
      set: (carrier) => emit('input', { ...props.value, carrier })
    })

    return {
      carrier
    }
  }
})
</script>
