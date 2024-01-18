<template>
  <div>
    <v-text-field
      v-model="deliveryInterval"
      v-bind="$attrs"
      :label="$t('Delivery Interval')"
      outlined
      hide-details="auto"
      type="number"
      persistent-hint
      :hint="$t('general.settings.checkout.delivery_interval')"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingDeliveryInterval',

  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const deliveryInterval = computed({
      get: () => props.value.delivery_interval,
      set: (delivery_interval) => emit('input', { ...props.value, delivery_interval })
    })

    return {
      deliveryInterval
    }
  }
})
</script>
