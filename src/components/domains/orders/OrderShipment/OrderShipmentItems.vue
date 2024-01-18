<template>
  <div class="d-flex flex-column flex-gap-16">
    <div v-for="item in items" :key="item.id">
      <div class="d-flex justify-space-between align-center">
        <div class="col-6 my-0 py-0">
          <order-item-preview :value="item" class="d-flex align-center" />
        </div>
        <div class="col-5 my-0 py-0d-flex flex-column align-center">
          <quantity-field
            v-model="itemQuantity(item.id).value"
            :max="maxToShip(item.id).value"
            :min="minToShip(item.id)"
          />
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="col-6 my-0 py-0">
          <span class="text-caption grey--text">{{ $t('Total quantity') }}: {{ getItemQuantity(item.id) }}</span>
        </div>
        <div class="col-5 d-flex flex-column align-center my-0 py-0">
          <span class="text-caption grey--text">{{ $t('Available to ship') }}: {{ maxToShip(item.id).value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getShippedItemCount } from '@futureecom/futureecom-js/dist/helpers/order/order-helpers'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import QuantityField from '@/components/common/QuantityField.vue'
import type { OrderItem, OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentItems',

  components: { QuantityField, OrderItemPreview },

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    },
    items: {
      type: Array as PropType<OrderItem[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const orderItems = structuredClone(props.items || [])
    const shipmentItems = structuredClone(props.value.items || [])

    const itemQuantity = (id: string) =>
      computed({
        get: () => (props.value.items || []).find((item) => item.item_id === id)?.quantity || 0,
        set: (quantity: number) => {
          const items = structuredClone(props.value.items || [])

          const foundIndex = items.findIndex((item) => item.item_id === id)
          const index = foundIndex >= 0 ? foundIndex : items.length

          items[index] = { item_id: id, quantity }
          emit('input', { ...props.value, items })
        }
      })

    const getItem = (id: string): OrderItem | undefined => orderItems.find((item) => item.id === id)
    const getItemQuantity = (id: string): number => getItem(id)?.quantity || 0

    const maxToShip = (id: string) => {
      return computed((): number => {
        const item = getItem(id)
        const currentlyShipped = shipmentItems.find((item) => item.item_id === id)
        return item ? item.quantity - getShippedItemCount(item) + (currentlyShipped?.quantity || 0) : 0
      })
    }

    const minToShip = (id: string) => (shipmentItems.find((item) => item.item_id === id)?.quantity ? 1 : 0)

    return {
      getItemQuantity,
      itemQuantity,
      maxToShip,
      minToShip
    }
  }
})
</script>
