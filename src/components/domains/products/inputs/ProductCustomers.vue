<template>
  <select-multiple-customer
    v-model="currentCustomers"
    :options="{ showChip: true, grid: gridOptions, filterId: 'product-customer' }"
    @input="onSelect"
  >
    <template #item.full_name="{ item }">
      <v-btn text class="no-uppercase" :to="{ name: 'customer-update', params: { id: item.id } }">
        {{ item.firstname }} {{ item.lastname }}
      </v-btn>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
  </select-multiple-customer>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleCustomer from '@/components/common/selectables/SelectMultipleCustomers.vue'
import useApi from '@/composable/useApi'
import type { Customer, CustomerGroup } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'ProductCustomers',
  components: { SelectMultipleCustomer },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const api = useApi()

    const currentCustomers = ref<Customer[]>()
    if (props.value.customer_ids?.length) {
      api.customers
        .customers({ filter: { id: props.value.customer_ids } })
        .then((val: ResponseCollection<Customer>) => (currentCustomers.value = val.data))
    }

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'full_name', sortable: false },
        { text: t('Email'), value: 'email' },
        { text: t('DOB'), value: 'dob' },
        { text: t('Created At'), value: 'created_at' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      return {
        headers
      }
    })

    const customer_ids = computed({
      get: () => props.value.customer_ids,
      set: (customer_ids) => emit('input', { ...props.value, customer_ids })
    })

    const onSelect = (val: CustomerGroup[]) => {
      customer_ids.value = val.map((item) => item.id)
    }

    return {
      gridOptions,
      currentCustomers,
      onSelect
    }
  }
})
</script>
