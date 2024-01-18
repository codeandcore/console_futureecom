<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="800" scrollable>
    <form-validator-wrapper @submit="shippingHandler">
      <template #default="{ valid }">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Shipping items') }}</span>

            <v-icon size="32" @click="showDialog = false">close</v-icon>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <order-ship-items-inputs v-model="form" :order="order" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-end ma-2 flex-gap-8">
            <rule-validator :value="form.items" :rules="rules.items" />
            <v-btn :disabled="!valid" depressed color="primary" type="submit" :loading="loading">
              {{ $t('Send') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import OrderShipItemsInputs from '@/components/domains/orders/OrderShipItemsInputs.vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import useApi from '@/composable/useApi'
import type { Order, OrderShipmentData, OrderShipmentItem } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentCreate',

  components: {
    RuleValidator,
    OrderShipItemsInputs,
    FormValidatorWrapper
  },

  props: {
    order: {
      type: Object as PropType<Order>,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  emits: ['created'],

  setup(props, { root, emit }) {
    const showDialog = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const form = ref<OrderShipmentData>({ items: [] })

    const loading = ref(false)

    const rules = {
      items: [
        (val: OrderShipmentItem[]) => !!val.find((item) => item.quantity > 0) || 'Select at least one item to ship'
      ]
    }

    const shippingHandler = (): void => {
      loading.value = true

      useApi()
        .orders.createShipment(props.order.number, {
          ...form.value,
          items: (form.value.items || []).filter((item) => item.quantity)
        })
        .then(() => emit('created'))
        .catch((err) => root.$toast.addErrorToast(err.response?.data.message || root.$t('Unable to ship items')))
        .finally(() => (loading.value = false))
    }

    return {
      showDialog,
      shippingHandler,
      loading,
      form,
      rules
    }
  }
})
</script>
