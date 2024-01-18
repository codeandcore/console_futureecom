<template>
  <div class="d-flex flex-column flex-gap-16">
    <order-shipment-comment-visible-for-customer v-if="shipmentId" v-model="orderShipmentData" />
    <order-shipment-items v-model="orderShipmentData" :items="availableItems" />
    <v-divider class="my-4" />
    <div class="d-flex flex-gap-16">
      <order-shipment-carrier v-model="orderShipmentData" />
      <order-shipment-tracking-number v-model="orderShipmentData" />
    </div>
    <order-shipment-notes v-model="orderShipmentData" />

    <switch-field v-model="showAddressForm" :label="$t('Set different address')" @input="onShowAddressChange" />

    <v-slide-y-reverse-transition mode="out-in">
      <order-shipment-to v-if="showAddressForm" v-model="orderShipmentData" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getShippedItemCount } from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import OrderShipmentCarrier from '@/components/domains/orders/OrderShipment/OrderShipmentCarrier.vue'
import OrderShipmentCommentVisibleForCustomer from '@/components/domains/orders/OrderShipment/OrderShipmentCommentVisibleForCustomer.vue'
import OrderShipmentItems from '@/components/domains/orders/OrderShipment/OrderShipmentItems.vue'
import OrderShipmentNotes from '@/components/domains/orders/OrderShipment/OrderShipmentNotes.vue'
import OrderShipmentTo from '@/components/domains/orders/OrderShipment/OrderShipmentTo.vue'
import OrderShipmentTrackingNumber from '@/components/domains/orders/OrderShipment/OrderShipmentTrackingNumber.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type {
  Order,
  OrderAddress,
  OrderItem,
  OrderShipmentData
} from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipItemsInputs',

  components: {
    OrderShipmentCommentVisibleForCustomer,
    SwitchField,
    OrderShipmentTo,
    OrderShipmentItems,
    OrderShipmentNotes,
    OrderShipmentTrackingNumber,
    OrderShipmentCarrier
  },

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    },
    shipmentId: {
      type: String,
      default: ''
    },
    order: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const showAddressForm = ref(false)

    const addressTemplate = (): OrderAddress => ({
      given_name: '',
      family_name: '',
      address_line1: '',
      country_code: '',
      administrative_area: '',
      postal_code: '',
      locality: ''
    })

    const persistentShipmentTo = ref<OrderShipmentData['to']>(
      props.value.to ? structuredClone(props.value.to) : undefined
    )

    const availableItems = computed(() => {
      return props.order.items.reduce((prev: OrderItem[], current: OrderItem) => {
        return getShippedItemCount(current) < current.quantity ? [...prev, current] : prev
      }, [])
    })

    const onShowAddressChange = (value: boolean) => {
      orderShipmentData.value = {
        ...props.value,
        to: value ? persistentShipmentTo.value || addressTemplate() : persistentShipmentTo.value
      }
    }

    const orderShipmentData = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      orderShipmentData,
      showAddressForm,
      availableItems,
      onShowAddressChange
    }
  }
})
</script>
