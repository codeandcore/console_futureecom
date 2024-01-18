<template>
  <div>
    <div v-for="key in itemKeys" :key="key" class="d-flex justify-space-between align-start">
      <div class="col-6">
        <order-item-preview :value="selectedItems[key]" class="d-flex align-center mb-2" />
        <span v-if="isItemRefunded(key)" class="mt-2">
          {{ $t('Subtotal refund') }}:
          {{ $format.money.withStoreCurrency(selectedItems[key].real_price, selectedItems[key].quantity) }}
        </span>
      </div>
      <div class="col-5 d-flex justify-end align-center">
        <quantity-field
          v-if="isItemRefunded(key)"
          v-model="selectedItems[key].quantity"
          :max="maxToReturn(key)"
          :min="0"
        />
        <span v-else>{{ $t('Item has been fully refunded') }}</span>
      </div>
    </div>

    <v-divider />

    <div v-if="!!order.shipping" class="col-12 py-0">
      <switch-field
        v-if="!order.shipping.refunded"
        v-model="refundShipping"
        class="my-4"
        :label="$t('Refund shipping')"
      />
      <div v-if="refundShipping">
        <span>
          {{ $t('Subtotal refund') }}:
          {{ $format.money.withStoreCurrency(order.shipping.total) }}
        </span>
      </div>
    </div>

    <v-divider />
    <div class="d-flex flex-column col-12 py-0 flex-gap-16 mt-4">
      <switch-field v-model="notifyCustomer" :label="$t('Notify Customer')" />
      <switch-field v-model="restockItems" :label="$t('Restock items')" />
      <switch-field v-model="offlineRefund" :label="$t('Offline refund')" :disabled="!isPaidOnline" />
      <v-alert v-if="!isPaidOnline" type="info" dense dismissible>
        <span>{{ $t('Online refunds are available only for online payments') }}</span>
      </v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import OrderItemPreview from '@/components/domains/orders/OrderItemPreview.vue'
import QuantityField from '@/components/common/QuantityField.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Order, OrderItem, OrderShipmentItem } from '@futureecom/futureecom-js/dist/services/order-service'

type MappedItemsQuantity = { [itemId: string]: OrderItem }

export default defineComponent({
  name: 'OrderRefundInputs',
  components: { SwitchField, QuantityField, OrderItemPreview },

  props: {
    order: {
      type: Object as () => Order,
      required: true
    }
  },

  setup(props, { emit }) {
    const isPaidOnline = props.order.payment && props.order.payment.type === 'online'
    const refundShipping = ref(false)
    const notifyCustomer = ref(false)
    const restockItems = ref(false)
    const offlineRefund = ref(!isPaidOnline)

    const selectedItems = ref<MappedItemsQuantity>({})

    cloneDeep(props.order.items).forEach((item: OrderItem) => {
      selectedItems.value = {
        ...selectedItems.value,
        [item.id]: { ...item, quantity: 0 }
      }
    })

    const itemKeys = computed((): string[] => Object.keys(selectedItems.value))

    const maxToReturn = (id: string): number => {
      const item = props.order.items.find((item) => item.id === id)
      return item ? item.quantity - item.quantity_refunded : 0
    }

    const isItemRefunded = (id: string): boolean => {
      return maxToReturn(id) > 0
    }

    watch(
      [refundShipping, notifyCustomer, restockItems, selectedItems, offlineRefund],
      () => {
        const keys = Object.keys(selectedItems.value) || []
        const items: OrderShipmentItem[] = []

        keys.forEach((item_id: string) => {
          items.push({
            item_id,
            quantity: selectedItems.value[item_id].quantity
          })
        })

        const dataEmitted = {
          notify: notifyCustomer.value,
          restock: restockItems.value,
          offline: offlineRefund.value,
          shipping: refundShipping.value,
          items: items.length ? items : undefined
        }

        emit('input', dataEmitted)
      },
      { deep: true, immediate: true }
    )

    return {
      maxToReturn,
      isItemRefunded,
      itemKeys,
      refundShipping,
      notifyCustomer,
      restockItems,
      offlineRefund,
      isPaidOnline,
      selectedItems
    }
  }
})
</script>
