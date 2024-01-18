<template>
  <div>
    <v-radio-group v-model="associated_customer_ids" class="d-flex flex-row">
      <v-radio v-for="(type, index) in accessList" :key="index" :label="type.name" :value="type.value" />
    </v-radio-group>
    <select-multiple-customer
      v-if="canSelectCustomers"
      v-model="currentCustomers"
      :options="{ showChip: true, grid: gridOptions, filterId: 'product-customer' }"
      @input="onSelect"
    >
      <template #item.full_name="{ item }">
        <v-btn
          :disabled="!(canRead && canUpdate && canDelete)"
          text
          class="no-uppercase"
          :to="{ name: 'customer-update', params: { id: item.id } }"
        >
          {{ item.firstname }} {{ item.lastname }}
        </v-btn>
      </template>
      <template #item.created_at="{ item }">
        <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
      </template>
    </select-multiple-customer>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/composition-api'
import { defineComponent, ref } from '@vue/composition-api/dist/vue-composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleCustomer from '@/components/common/selectables/SelectMultipleCustomers.vue'
import useApi from '@/composable/useApi'
import type { AdminUser } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'UserAssociatedCustomers',

  components: { SelectMultipleCustomer },

  props: {
    value: {
      type: Object as PropType<AdminUser>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const api = useApi()

    const currentCustomers = ref<Customer[]>([])

    if (props.value.associated_customers?.length) {
      api.customers
        .customers({ filter: { id: props.value.associated_customers }, perPage: -1 })
        .then((customers) => (currentCustomers.value = customers.data))
    }

    const associated_customer_ids = computed({
      get: () => props.value.associated_customers,
      set: (associated_customer_ids) => emit('input', { ...props.value, associated_customers: associated_customer_ids })
    })

    const accessList = computed(() => [
      { name: t('Access to all customers'), value: ['*'] },
      { name: t('No access to customers'), value: null },
      { name: t('Associated customers'), value: [] }
    ])

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'full_name', sortable: false },
        { text: t('Email'), value: 'email' },
        { text: t('DOB'), value: 'dob' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      return {
        headers
      }
    })

    const canSelectCustomers = computed(() => {
      return Array.isArray(associated_customer_ids.value) && !associated_customer_ids.value.includes('*')
    })

    const { canRead, canUpdate, canDelete } = useCrudChecker('customers\\customer')

    const onSelect = (customers: Customer[]) => {
      associated_customer_ids.value = customers.map((customer) => customer.id)
    }

    return {
      accessList,
      gridOptions,
      currentCustomers,
      associated_customer_ids,
      canSelectCustomers,
      canRead,
      canUpdate,
      canDelete,
      onSelect
    }
  }
})
</script>
