<template>
  <div class="d-flex flex-column flex-gap-16">
    <div class="d-flex flex-column">
      <span :class="{ 'error--text': errorMessage }">{{ $t('Customer') }}:</span>
      <span v-if="errorMessage" class="error--text text-caption">{{ errorMessage }}</span>
    </div>

    <readonly-card v-if="readonly">
      <div v-if="currentCustomer && canReadCustomer" class="d-flex flex-column">
        <span>{{ currentCustomer.firstname }} {{ currentCustomer.lastname }}</span>
        <span>{{ currentCustomer.email }}</span>
        <span>{{ currentCustomer.id }}</span>
      </div>
      <span v-else>{{ $t('Customer ID') }}: {{ value.customer_id }}</span>
    </readonly-card>

    <div v-else-if="!loading.customer && !loading.representatives">
      <select-multiple-customers
        :value="currentCustomers"
        :options="{ showChip: true, grid: gridOptions, excluded_ids: representativeCustomerIds }"
        :error-message="$attrs.errorMessage"
        @input="onSelect"
      >
        <template #item.firstname="{ item }">
          <span :class="{ 'grey--text': !item.isSelectable }">{{ item.firstname }}</span>
        </template>
        <template #item.lastname="{ item }">
          <span :class="{ 'grey--text': !item.isSelectable }">{{ item.lastname }}</span>
        </template>
        <template #item.email="{ item }">
          <span :class="{ 'grey--text': !item.isSelectable }">{{ item.email }}</span>
        </template>
      </select-multiple-customers>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import ReadonlyCard from '@/components/common/ReadonlyCard.vue'
import SelectMultipleCustomers from '@/components/common/selectables/SelectMultipleCustomers.vue'
import useApi from '@/composable/useApi'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type {
  NewRepresentative,
  UpdateRepresentative
} from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'RepresentativeCommissionCustomerId',
  components: { ReadonlyCard, SelectMultipleCustomers },

  props: {
    value: {
      type: Object as PropType<NewRepresentative | UpdateRepresentative>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const loading = reactive({
      customer: false,
      representatives: true
    })

    const api = useApi()
    const currentCustomers = ref<Customer[]>([])
    const representativeCustomerIds = ref<string[]>([])

    const { canRead: canReadCustomer } = useCrudChecker('customers\\customer')

    const customerId = computed({
      get: () => props.value.customer_id,
      set: (customer_id) => emit('input', { ...props.value, customer_id })
    })

    const currentCustomer = computed((): Customer | undefined => currentCustomers.value[0])

    if (props.value.customer_id && canReadCustomer.value && !props.readonly) {
      loading.customer = true

      api.customers
        .getCustomer(props.value.customer_id)
        .then((val) => (currentCustomers.value = [val]))
        .finally(() => (loading.customer = false))
    }

    const gridOptions = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Firstname'), value: 'firstname' },
        { text: t('Lastname'), value: 'lastname' },
        { text: t('Email'), value: 'email' }
      ]

      return {
        headers
      }
    })

    const onSelect = (val: Customer[]) => {
      currentCustomers.value = val.length > 1 ? val.filter((item) => item.id !== props.value.customer_id) : val
      customerId.value = currentCustomers.value[0]?.id
    }

    api.commissions
      .representatives({ filter: { user_id: props.value.user_id }, perPage: -1 })
      .then((response) => (representativeCustomerIds.value = response.data.map((item) => item.customer_id)))
      .finally(() => (loading.representatives = false))

    return {
      gridOptions,
      currentCustomer,
      currentCustomers,
      canReadCustomer,
      onSelect,
      loading,
      representativeCustomerIds
    }
  }
})
</script>
