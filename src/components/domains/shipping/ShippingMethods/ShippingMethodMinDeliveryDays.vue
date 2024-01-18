<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="min_delivery_days"
    :label="$t('Min delivery days')"
    outlined
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodMinDeliveryDays',

  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const min_delivery_days = computed({
      get: () => props.value.min_delivery_days,
      set: (val) => emit('input', { ...props.value, min_delivery_days: typeof val === 'number' ? val : null })
    })

    return {
      min_delivery_days
    }
  }
})
</script>
