<template>
  <v-select
    v-model="rule"
    :label="$t('Rule')"
    dense
    outlined
    hide-details="auto"
    :items="rules"
    clearable
    data-cy="filters-advanced-rules"
  >
    <template #item="{ item }">
      <span data-cy="filters-advanced-rules-item" class="text-capitalize">
        {{ $t(getOperatorLabel(item)) }}
      </span>
    </template>
    <template #selection="{ item }">
      <span data-cy="filters-advanced-rules-selection" class="text-capitalize">
        {{ $t(getOperatorLabel(item)) }}
      </span>
    </template>
  </v-select>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getOperatorLabel } from '@/libs/tables/filters'
import type { AdvancedFilters, MathOperator } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersAdvancedRules',

  props: {
    value: {
      type: Object as PropType<AdvancedFilters>,
      required: true
    },
    rules: {
      type: Array as PropType<(MathOperator | 'like' | 'all')[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const rule = computed({
      get: () => props.value.rule,
      set: (rule) => emit('input', { ...props.value, rule: rule === null ? undefined : rule })
    })

    return {
      rule,
      getOperatorLabel
    }
  }
})
</script>
