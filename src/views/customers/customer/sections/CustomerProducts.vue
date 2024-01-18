<template>
  <div class="d-flex flex-column">
    <expandable-content>
      <template #title>
        <span>{{ $t('Featured Products') }} {{ `(${(customer.featured_products || []).length})` }}</span>
      </template>
      <template #content>
        <customer-featured-products v-model="customer" class="d-flex flex-column flex-gap-16 ma-4" />
      </template>
    </expandable-content>

    <v-divider class="my-8" />

    <expandable-content>
      <template #title>
        <span>{{ $t('Bestseller Products') }} {{ `(${(customer.bestseller_products || []).length})` }}</span>
      </template>
      <template #content>
        <customer-bestseller-products v-model="customer" class="d-flex flex-column flex-gap-16 ma-4" />
      </template>
    </expandable-content>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CustomerBestsellerProducts from '@/components/domains/customers/customer/CustomerBestsellerProducts.vue'
import CustomerFeaturedProducts from '@/components/domains/customers/customer/CustomerFeaturedProducts.vue'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import Restricted from '@/views/Restricted.vue'
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'CustomerProducts',

  components: { Restricted, CustomerBestsellerProducts, CustomerFeaturedProducts, ExpandableContent },

  props: {
    value: {
      type: Object as () => CustomerDetailsResponse,
      required: true
    }
  },

  setup(props, { emit }) {
    const customer = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      customer
    }
  }
})
</script>
