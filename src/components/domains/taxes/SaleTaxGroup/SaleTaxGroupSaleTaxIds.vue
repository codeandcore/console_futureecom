<template>
  <expandable-content outlined>
    <template #title>
      <selectable-resource-header
        :errors="{ tax_rate_ids: errors['tax_rate_ids'], ...chipErrors }"
        :title="$t('Sale Tax Rates')"
        :items="value.tax_rate_ids"
      >
        <template #subtitle>
          <span class="error--text text-caption">{{ errors['tax_rate_ids'] }}</span>
        </template>
      </selectable-resource-header>
    </template>
    <template #content>
      <v-divider />
      <selectable-sale-taxes
        v-model="saleTaxGroup"
        :items="saleTaxGroup.rates"
        :grid-options="saleTaxOptions"
        :request-options="{ sort: ['-created_at'] }"
        show-chips
        multiple
        class="ma-4"
        :errors="chipErrors"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import SelectableSaleTaxes from '@/components/common/selectables/resources/SelectableSaleTaxes.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SaleTaxGroupSaleTaxIds',

  components: { SelectableResourceHeader, ExpandableContent, SelectableSaleTaxes },
  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
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

    const saleTaxOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' },
        { text: t('Rate'), value: 'rate' }
      ]
      return { headers }
    })

    const chipErrors = computed(() => getChipErrors('tax_rate_ids', props.errors))

    return {
      saleTaxGroup,
      saleTaxOptions,
      chipErrors
    }
  }
})
</script>
