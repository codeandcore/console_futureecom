<template>
  <v-text-field
    v-bind="$attrs"
    v-model="deviceIpAddress"
    :label="$t('Device address IP')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentCardknoxPOS } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CardknoxDeviceIpAddress',

  props: {
    value: {
      type: Object as PropType<PaymentCardknoxPOS>,
      required: true
    }
  },

  setup(props, { emit }) {
    const deviceIpAddress = computed({
      get: () => props.value.deviceIpAddress,
      set: (deviceIpAddress) => emit('input', { ...props.value, deviceIpAddress })
    })

    return {
      deviceIpAddress
    }
  }
})
</script>
