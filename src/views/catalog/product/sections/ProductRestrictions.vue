<template>
  <div class="d-flex flex-column">
    <product-application v-model="product" />
    <span class="mt-8 mb-4">{{ $t('Allowed Groups') }}{{ hasSelectedGroups ? '' : `: (${$t('all')})` }}</span>
    <product-customer-groups v-model="product" />
    <span class="mt-8 mb-4">{{ $t('Limited to customers') }}{{ hasSelectedCustomers ? '' : `: (${$t('none')})` }}</span>
    <product-customers v-model="product" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

import ProductApplication from '@/components/domains/products/inputs/ProductApplications.vue'
import ProductCustomerGroups from '@/components/domains/products/inputs/ProductCustomerGroups.vue'
import ProductCustomers from '@/components/domains/products/inputs/ProductCustomers.vue'

export default defineComponent({
  name: 'ProductRestrictions',
  components: { ProductCustomers, ProductCustomerGroups, ProductApplication },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    return {
      product,
      hasSelectedGroups: computed(() => (props.value.customer_group || []).length > 0),
      hasSelectedCustomers: computed(() => (props.value.customer_ids || []).length > 0)
    }
  }
})
</script>
