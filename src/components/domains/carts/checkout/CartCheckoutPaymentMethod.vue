<template>
  <div class="d-flex flex-column flex-gap-16">
    <selectable-card
      v-for="payment in paymentMethods"
      :key="payment.id"
      :loading="loading"
      :disabled="loading"
      :class="{ 'v-card__active': paymentMethod === payment.code }"
      @onSelect="paymentMethod = payment.code"
    >
      <div class="flex-grow-1 d-flex justify-space-between px-3">
        <span>{{ payment.name }}</span>
      </div>
    </selectable-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import SelectableCard from '@/components/common/selectables/SelectableCard.vue'
import useApi from '@/composable/useApi'
import type { PaymentMethodResponse } from '@futureecom/futureecom-js/dist/services/payment-service'

export default defineComponent({
  name: 'CartCheckoutPaymentMethod',

  components: { SelectableCard },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const paymentMethod = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const paymentMethods = ref<PaymentMethodResponse[]>([])

    const loading = ref(true)

    useApi()
      .payments.methods({ perPage: -1, filter: { enabled: { eq: true }, provider: 'offline' } })
      .then((val) => (paymentMethods.value = val.data))
      .catch(() => addErrorToast(t('Unable to fetch payment methods')))
      .finally(() => (loading.value = false))

    return {
      paymentMethod,
      paymentMethods,
      loading
    }
  }
})
</script>
