<template>
  <div>
    <cardknox-x-key v-model="payment" class="required" :error-messages="errors['xKey']" />
    <cardknox-i-fields-key v-model="payment" class="required" :error-messages="errors['iFieldsKey']" />
    <cardknox-device-ip-address v-model="payment" class="required" :error-messages="errors['deviceIpAddress']" />
    <cardknox-device-ip-port v-model="payment" class="required" :error-messages="errors['deviceIpPort']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CardknoxDeviceIpAddress from '@/components/domains/payments/providers/Cardknox/CardknoxDeviceIpAddress.vue'
import CardknoxDeviceIpPort from '@/components/domains/payments/providers/Cardknox/CardknoxDeviceIpPort.vue'
import CardknoxIFieldsKey from '@/components/domains/payments/providers/Cardknox/CardknoxIFieldsKey.vue'
import CardknoxXKey from '@/components/domains/payments/providers/Cardknox/CardknoxXKey.vue'
import type { PaymentCardknoxPOS } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentCardknox',

  components: { CardknoxDeviceIpAddress, CardknoxDeviceIpPort, CardknoxIFieldsKey, CardknoxXKey },

  props: {
    value: {
      type: Object as PropType<PaymentCardknoxPOS>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const payment = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      payment
    }
  }
})
</script>
