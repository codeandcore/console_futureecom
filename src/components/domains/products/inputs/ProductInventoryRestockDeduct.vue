<template>
  <div>
    <div class="d-flex align-center justify-space-between my-6">
      <span>{{ $t('Quantity') }}:</span>
      <span class="text-h5">{{ currentProduct.inventory.quantity }}</span>
    </div>

    <div class="d-flex justify-center align-center mt-2">
      <product-deduct-quantity v-model="currentProduct" :quantity="quantity" @input="onUpdate" />
      <div>
        <v-text-field
          v-model.number="quantity"
          v-mask="$format.mask.quantityMask"
          :disabled="!trackable"
          outlined
          :label="$t('Restock/Deduct Quantity')"
          hide-details="auto"
          class="mx-4"
        />
      </div>
      <product-restock-quantity v-model="currentProduct" :quantity="quantity" @input="onUpdate" />
    </div>

    <div v-if="!trackable || !restockable" class="text-caption grey--text mt-4 text-center d-flex flex-column">
      <span v-if="!trackable" key="trackable">
        {{ $t("Quantity won't change when product inventory is not tracked") }}
      </span>
      <span v-if="!restockable" key="restockable">
        {{ $t('Product is not restockable.') }}
      </span>
      <span key="update">{{ $t('Update product first.') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ProductDeductQuantity from '@/components/domains/products/inputs/ProductDeductQuantity.vue'
import ProductRestockQuantity from '@/components/domains/products/inputs/ProductRestockQuantity.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryRestockDeduct',
  components: { ProductRestockQuantity, ProductDeductQuantity },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props, { emit }) {
    const quantity = ref<number>()
    const currentProduct = ref<Product>(structuredClone(props.value))

    const restockable = computed(() => currentProduct.value.inventory.is_restockable)
    const trackable = computed(() => currentProduct.value.inventory.track)

    const onUpdate = (val: Product) => {
      quantity.value = undefined
      emit('input', val)
    }

    return {
      currentProduct,
      quantity,
      restockable,
      trackable,
      onUpdate
    }
  }
})
</script>
