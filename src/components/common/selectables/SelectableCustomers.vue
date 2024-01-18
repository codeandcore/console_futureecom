<template>
  <selectable-resource
    v-model="selected"
    v-bind="$attrs"
    :headers="headers"
    :items="items"
    :resource="resource"
    search-criteria="firstname"
    :can-read="canRead"
  >
    <template #deletable-chip-item="{ item }">{{ item.firstname }} {{ item.lastname }}</template>
  </selectable-resource>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import SelectableResource from '@/components/common/selectables/SelectableResource.vue'
import useApi from '@/composable/useApi'
import type {
  Customer,
  CustomerGridRequest,
  CustomerResponse
} from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'SelectableCustomers',
  components: { SelectableResource },
  props: {
    value: {
      type: Array as PropType<Customer[]>,
      default: (): Customer[] => []
    },
    items: {
      type: Array as PropType<Customer[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { canRead } = useCrudChecker('customers\\customer')

    const api = useApi()

    const selected = computed({
      get: () => props.value,
      set: (items) => emit('input', items)
    })

    const resource = (params: CustomerGridRequest): Promise<ResponseCollection<CustomerResponse>> => {
      return api.customers.customers({ ...params, sort: ['-created_at'] })
    }

    const headers = computed(() => [
      { text: t('Firstname'), value: 'firstname' },
      { text: t('Lastname'), value: 'lastname' },
      { text: t('Email'), value: 'email' }
    ])

    return {
      selected,
      resource,
      headers,
      canRead
    }
  }
})
</script>
