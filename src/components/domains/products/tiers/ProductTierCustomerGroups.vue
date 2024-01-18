<template>
  <select-multiple-customer-group
    v-model="currentCustomerGroups"
    :options="{ showChip: true, grid: gridOptions, filterId: 'product-tier-customer-group' }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleCustomerGroup from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ProductTierCustomerGroups',

  components: { SelectMultipleCustomerGroup },

  props: {
    value: {
      type: Object as PropType<ProductTier>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const currentCustomerGroups = ref<CustomersGroups[]>()

    if (props.value.customer_groups?.length) {
      useApi()
        .customers.groups({ filter: { code: props.value.customer_groups } })
        .then((val) => (currentCustomerGroups.value = val.data))
    }

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    const customer_group = computed({
      get: () => props.value.customer_groups,
      set: (customer_groups) => emit('input', { ...props.value, customer_groups })
    })

    const onSelect = (val: CustomersGroups[]) => {
      currentCustomerGroups.value = val
      customer_group.value = val.map((item) => item.code)
    }

    return {
      currentCustomerGroups,
      gridOptions,
      onSelect
    }
  }
})
</script>
