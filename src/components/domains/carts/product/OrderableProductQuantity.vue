<template>
  <div>
    <quantity-field v-model="quantity" :min="minQuantity" :max="maxQuantity" v-bind="$attrs" />
    <scrollable v-if="(product.tiers || []).length" height="200px" class="mt-5">
      <template #scrollable>
        <cart-product-tiers v-model="quantity" v-bind="{ customerGroups, product }" />
      </template>
    </scrollable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import {
  getAvailableMaxQuantity,
  getAvailableMinQuantity
} from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import CartProductTiers from './CartProductTiers.vue'
import QuantityField from '@/components/common/QuantityField.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type {
  OrderableCustomerGroupDetails,
  OrderableGuestGroupDetails,
  UpdateOrderableItem
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartAddItemQuantity',

  components: { Scrollable, CartProductTiers, QuantityField },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Pick<UpdateOrderableItem, 'quantity'>>,
      required: true
    },
    customerGroups: {
      type: Array as PropType<(OrderableGuestGroupDetails | OrderableCustomerGroupDetails)[]>,
      default: () => []
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const quantity = computed({
      get: () => props.value.quantity || 1,
      set: (quantity: number) => {
        if (maxQuantity.value && quantity > maxQuantity.value) {
          emit('input', { ...props.value, quantity: maxQuantity.value | 1 })
          return
        }
        if (quantity < minQuantity.value) {
          emit('input', { ...props.value, quantity: minQuantity.value | 1 })
          return
        }
        emit('input', { ...props.value, quantity })
      }
    })

    const minQuantity = computed((): number => {
      const { policy, quantity, min_per_order } = props.product.inventory
      return getAvailableMinQuantity({ inventory: { policy, quantity, min_per_order } })
    })

    const maxQuantity = computed((): number => {
      const { policy, quantity, max_per_order } = props.product.inventory
      return getAvailableMaxQuantity({ inventory: { policy, quantity, max_per_order } })
    })

    return {
      quantity,
      minQuantity,
      maxQuantity
    }
  }
})
</script>
