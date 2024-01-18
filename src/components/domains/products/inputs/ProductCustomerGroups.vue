<template>
  <select-multiple-customer-groups
    v-model="currentCustomerGroups"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleCustomerGroups from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'ProductCustomerGroups',
  components: { SelectMultipleCustomerGroups },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const api = useApi()

    const currentCustomerGroups = ref<CustomersGroups[]>()
    if (props.value.customer_group?.length) {
      api.customers
        .groups({ filter: { code: props.value.customer_group } })
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
      onSelect
    }
  }
})
</script>
