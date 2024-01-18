<template>
  <select-multiple-customer-group v-model="groups" :options="{ showChip: true, grid: gridOptions }" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectMultipleCustomerGroup from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import isCustomerB2B from '@/components/domains/customers/customer/helpers/isCustomerB2B'
import useApi from '@/composable/useApi'
import type { BaseCustomer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'CustomerGroup',

  components: { SelectMultipleCustomerGroup },

  props: {
    value: {
      type: Object as PropType<BaseCustomer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()

    const groups = computed({
      get: () => props.value.groups || [],
      set: (groups) => {
        const isB2B = isCustomerB2B(groups || [])

        emit('input', {
          ...props.value,
          groups,
          featured_products: isB2B ? props.value.featured_products : undefined,
          bestseller_products: isB2B ? props.value.bestseller_products : undefined
        })
      }
    })

    if (props.value.group_ids?.length) {
      api.customers.groups({ filter: { id: props.value.group_ids } }).then((val) => (groups.value = val.data))
    }

    const gridOptions = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    return {
      groups,
      gridOptions
    }
  }
})
</script>
