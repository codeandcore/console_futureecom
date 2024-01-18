<template>
  <div>
    <span>{{ $t('Allowed Groups') }} {{ hasSelectedGroups ? '' : '(all)' }}</span>
    <select-multiple-customer-group
      v-model="currentCustomerGroups"
      :options="{ showChip: true, grid: gridOptions }"
      @input="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import SelectMultipleCustomerGroup from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'PageCustomerGroup',
  components: { SelectMultipleCustomerGroup },

  props: {
    value: {
      type: Object as PropType<Page>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()

    const currentCustomerGroups = ref<CustomersGroups[]>()
    if (props.value.customer_group?.length) {
      api.customers
        .groups({ filter: { code: props.value.customer_group } })
        .then((val) => (currentCustomerGroups.value = val.data))
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

    const customer_group = computed({
      get: () => props.value.customer_group,
      set: (customer_group) => emit('input', { ...props.value, customer_group })
    })

    const onSelect = (val: CustomersGroups[]) => {
      currentCustomerGroups.value = val
      customer_group.value = val.map((item) => item.code)
    }

    return {
      gridOptions,
      currentCustomerGroups,
      onSelect,
      hasSelectedGroups: computed(() => (customer_group.value || []).length > 0)
    }
  }
})
</script>
