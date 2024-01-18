<template>
  <div>
    <heartland-public-api-key v-model="payment" />
    <heartland-secret-api-key v-model="payment" />
    <heartland-developer-id v-model="payment" />
    <heartland-version-number v-model="payment" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import HeartlandDeveloperId from '@/components/domains/payments/providers/Heartland/HeartlandDeveloperId.vue'
import HeartlandPublicApiKey from '@/components/domains/payments/providers/Heartland/HeartlandPublicApiKey.vue'
import HeartlandSecretApiKey from '@/components/domains/payments/providers/Heartland/HeartlandSecretApiKey.vue'
import HeartlandVersionNumber from '@/components/domains/payments/providers/Heartland/HeartlandVersionNumber.vue'
import type { PaymentHeartland } from '@/types/plugins/HeartlandPayment'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentHeartlandInputs',

  components: { HeartlandVersionNumber, HeartlandDeveloperId, HeartlandSecretApiKey, HeartlandPublicApiKey },

  props: {
    value: {
      type: Object as PropType<PaymentHeartland>,
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
