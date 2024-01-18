<template>
  <div class="d-flex flex-column">
    <product-inventory-available v-model="product" data-cy="inventory-track" class="my-4" />

    <div class="d-flex flex-row flex-gap-16">
      <product-sku v-model="product" data-cy="inventory-sku" :rules="validator.rules.sku" class="required" />
      <product-quantity
        v-if="!value.id && !isBundle"
        v-model="product"
        data-cy="inventory-quantity"
        :rules="validator.rules.quantity"
        class="required"
      />
    </div>
    <div class="d-flex flex-row flex-gap-16">
      <product-inventory-min-per-order v-model="product" />
      <product-inventory-max-per-order v-model="product" />
    </div>

    <div v-if="!isBundle">
      <product-policy v-model="product" data-cy="inventory-policy" />
      <product-inventory-track v-model="product" data-cy="inventory-track" class="my-4" />
      <product-inventory-restock v-model="product" data-cy="inventory-is-restockable" class="my-4" />
      <product-inventory-bundle-exclusive v-model="product" data-cy="inventory-is-bundle-exclusive" class="my-4" />
    </div>

    <div v-if="!!value.id && !isBundle" class="d-flex flex-column justify-center mt-6">
      <v-divider />
      <product-inventory-restock-deduct v-model="product" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ProductInventoryAvailable from '@/components/domains/products/inputs/ProductInventoryAvailable.vue'
import ProductInventoryBundleExclusive from '@/components/domains/products/inputs/ProductInventoryBundleExclusive.vue'
import ProductInventoryMaxPerOrder from '@/components/domains/products/inputs/ProductInventoryMaxPerOrder.vue'
import ProductInventoryMinPerOrder from '@/components/domains/products/inputs/ProductInventoryMinPerOrder.vue'
import ProductInventoryRestock from '@/components/domains/products/inputs/ProductInventoryRestock.vue'
import ProductInventoryRestockDeduct from '@/components/domains/products/inputs/ProductInventoryRestockDeduct.vue'
import ProductInventoryTrack from '@/components/domains/products/inputs/ProductInventoryTrack.vue'
import ProductPolicy from '@/components/domains/products/inputs/ProductPolicy.vue'
import ProductQuantity from '@/components/domains/products/inputs/ProductQuantity.vue'
import ProductSku from '@/components/domains/products/inputs/ProductSku.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductValidator } from '@/composable/resources/useProduct'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventory',

  components: {
    ProductInventoryRestockDeduct,
    ProductQuantity,
    ProductInventoryMaxPerOrder,
    ProductInventoryMinPerOrder,
    ProductInventoryBundleExclusive,
    ProductInventoryRestock,
    ProductInventoryTrack,
    ProductPolicy,
    ProductSku,
    ProductInventoryAvailable
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    },
    validator: {
      type: Object as PropType<ProductValidator>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    const isBundle = computed(() => props.value.classification === 'bundle')

    return {
      product,
      isBundle
    }
  }
})
</script>
