<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="800" scrollable>
    <form-validator-wrapper @submit="shippingHandler">
      <template #default="{ valid }">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Update shipment') }}</span>

            <v-icon size="32" @click="showDialog = false">close</v-icon>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <order-ship-items-inputs v-model="form" :order="order" :shipment-id="shipment.id" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-end ma-2">
            <v-btn :disabled="!valid" depressed color="primary" type="submit" :loading="loading">
              {{ $t('Update') }}
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
import getShipmentData from '@/libs/domains/orders/getShipmentData'
import useApi from '@/composable/useApi'
import type { Order, OrderShipment, OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentUpdate',

  components: {
    OrderShipItemsInputs,
    FormValidatorWrapper
  },

  props: {
    order: {
      type: Object as PropType<Order>,
      required: true
    },
    shipment: {
      type: Object as PropType<OrderShipment>,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  emits: ['updated'],

  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const form = ref<OrderShipmentData>(getShipmentData(props.shipment))
    const loading = ref(false)

    const shippingHandler = (): void => {
      loading.value = true

      const { carrier, items, notes, to, tracking_number, comment_visible_for_customer } = form.value

      useApi()
        .orders.updateShipment(props.order.number, props.shipment.id, {
          carrier,
          items: (items || []).filter((item) => item.quantity),
          notes,
          to,
          tracking_number,
          comment_visible_for_customer
        })
        .then(() => emit('updated'))
        .finally(() => (loading.value = false))
    }

    return {
      showDialog,
      shippingHandler,
      loading,
      form
    }
  }
})
</script>
