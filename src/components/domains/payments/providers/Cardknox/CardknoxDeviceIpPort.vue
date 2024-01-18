<template>
  <v-text-field
    v-bind="$attrs"
    v-model="deviceIpPort"
    :label="$t('Device address port')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentCardknoxPOS } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CardknoxDeviceIpPort',

  props: {
    value: {
      type: Object as PropType<PaymentCardknoxPOS>,
      required: true
    }
  },

  setup(props, { emit }) {
    const deviceIpPort = computed({
      get: () => props.value.deviceIpPort,
      set: (deviceIpPort) => emit('input', { ...props.value, deviceIpPort })
    })

    return {
      deviceIpPort
    }
  }
})
</script>
