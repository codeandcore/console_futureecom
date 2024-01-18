<template>
  <div v-if="canReadCustomerGroups" class="d-flex flex-gap-8 flex-column">
    <span>{{ $t('Allowed Customer Groups') }}</span>
    <span v-if="!currentCustomerGroups.length" class="text-caption my-2 error--text">
      {{ $t('If no group(s) are selected, no one will be able to convert to quote') }}
    </span>
    <select-multiple-customer-group
      v-model="currentCustomerGroups"
      :options="{ showChip: true, grid: gridOptions }"
      @input="onSelect"
    />
  </div>
  <readonly-card v-else-if="(value.allowed_customer_groups || []).length">
    <div class="d-flex flex-gap-8 align-center">
      <span>{{ $t('Allowed Customer Groups') }}:</span>
      <span>{{ value.allowed_customer_groups.join(', ') }}</span>
    </div>
  </readonly-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ReadonlyCard from '@/components/common/ReadonlyCard.vue'
import SelectMultipleCustomerGroup from '@/components/common/selectables/SelectMultipleCustomerGroups.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'GeneralSettingsQuoteAllowedCustomerGroups',

  components: { ReadonlyCard, SelectMultipleCustomerGroup },

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; allowed_customer_groups: string[] | null }>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const canReadCustomerGroups = computed(() => root.$can('read,customers\\group', 'manage,customers\\group').value)

    const currentCustomerGroups = ref<(CustomersGroups | string)[]>(props.value.allowed_customer_groups || [])

    if (props.value.allowed_customer_groups?.length && canReadCustomerGroups.value) {
      useApi()
        .customers.groups({ perPage: -1, filter: { code: props.value.allowed_customer_groups } })
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

    const allowedCustomerGroups = computed({
      get: () => props.value.allowed_customer_groups,
      set: (allowed_customer_groups) => emit('input', { ...props.value, allowed_customer_groups })
    })

    const onSelect = (val: CustomersGroups[]) => {
      currentCustomerGroups.value = val
      allowedCustomerGroups.value = val.length ? val.map((item) => item.code) : null
    }

    return {
      currentCustomerGroups,
      canReadCustomerGroups,
      gridOptions,
      onSelect
    }
  }
})
</script>
