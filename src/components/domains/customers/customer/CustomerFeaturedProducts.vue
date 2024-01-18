<template>
  <select-multiple-products v-model="products" :options="{ showChip: true, grid: gridOptions }" @input="onSelect">
    <template #item.sku="{ item }">
      <v-btn depressed plain text small :to="{ name: 'product-update', params: { id: item.id } }">
        {{ item.sku }}
      </v-btn>
    </template>
    <template #item.data-table-select="{ item, isSelected, select }">
      <v-simple-checkbox v-if="canAdd(item).value" :ripple="false" :value="isSelected" @input="select($event)" />
    </template>
  </select-multiple-products>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { isAvailableForCustomerGroup } from '@futureecom/futureecom-js/dist/helpers/cart/cart-helpers'
import SelectMultipleProducts from '@/components/common/selectables/SelectMultipleProducts.vue'
import useApi from '@/composable/useApi'
import type { BaseCustomer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CustomerFeaturedProducts',

  components: { SelectMultipleProducts },

  props: {
    value: {
      type: Object as PropType<BaseCustomer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const products = ref<Product[]>([])

    if ((props.value.featured_products || []).length) {
      api.catalog.products({ filter: { id: props.value.featured_products } }).then((val) => (products.value = val.data))
    }

    const featured_products = computed({
      get: () => props.value.featured_products || [],
      set: (featured_products) => emit('input', { ...props.value, featured_products })
    })

    const gridOptions = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('SKU'), value: 'sku' },
        { text: ctx.$t('Classification'), value: 'classification' }
      ]

      return {
        headers
      }
    })

    const onSelect = (val: Product[]) => {
      products.value = val
      featured_products.value = val.map((item) => item.id)
      emit('update:items', val)
    }

    const canAdd = (item: Product) => {
      return computed(() => {
        const customerGroups = (props.value.groups || []).map((group) => group.code)
        return isAvailableForCustomerGroup(item, customerGroups)
      })
    }

    return {
      products,
      onSelect,
      gridOptions,
      canAdd
    }
  }
})
</script>
