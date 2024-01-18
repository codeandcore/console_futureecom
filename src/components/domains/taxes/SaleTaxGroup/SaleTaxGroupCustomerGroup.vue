<template>
  <expandable-content outlined>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Customer group')" :items="[value.customer_group]" />
    </template>
    <template #content>
      <v-divider />
      <selectable-customer-groups
        v-model="saleTaxGroup"
        :grid-options="customerGroupOptions"
        show-chips
        class="ma-4"
        :errors="chipErrors"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableCustomerGroups from '@/components/common/selectables/resources/SelectableCustomerGroups.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'CategoryCustomerGroup',
  components: { SelectableResourceHeader, SelectableCustomerGroups, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Partial<TaxRateGroup>>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const saleTaxGroup = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const customerGroupOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    const chipErrors = computed(() => (props.errors['customer_group'] ? { '0': props.errors['customer_group'] } : {}))

    return {
      saleTaxGroup,
      customerGroupOptions,
      chipErrors
    }
  }
})
</script>
