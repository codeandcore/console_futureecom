<template>
  <select-multiple-customer-group
    v-model="currentCustomerGroups"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import SelectMultipleCustomerGroup from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'PromotionCustomerGroup',
  components: { SelectMultipleCustomerGroup },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const currentCustomerGroups = ref<CustomersGroups[]>()

    if (props.value.customer_group?.length) {
      api.customers
        .groups({ filter: { code: props.value.customer_group } })
        .then((val) => (currentCustomerGroups.value = val.data))
    }

    const customer_group = computed({
      get: () => props.value.customer_group,
      set: (customer_group) => emit('input', { ...props.value, customer_group })
    })

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: root.$t('Name'), value: 'name' },
        { text: root.$t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    const onSelect = (val: CustomersGroups[]) => {
      currentCustomerGroups.value = val
      customer_group.value = val.map((item) => item.code)
    }

    return {
      currentCustomerGroups,
      onSelect,
      gridOptions
    }
  }
})
</script>
