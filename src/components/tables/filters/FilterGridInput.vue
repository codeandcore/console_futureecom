<template>
  <div v-if="isTypeCustomizable" class="d-flex flex-column flex-gap-16">
    <div class="d-flex">
      <filter-text v-if="definition.type === 'text'" v-model="filter" :label="definition.label" hide-details="auto" />
      <filter-select-multiple
        v-else-if="definition.type === 'select-multiple'"
        v-model="filter"
        :label="definition.label"
        :items="definition.options || []"
        multiple
      />

      <filter-array
        v-else-if="definition.type === 'array'"
        v-model="filter"
        :label="definition.label"
        :items="definition.options || []"
        multiple
      />

      <v-btn
        class="mx-4 ma-1"
        fab
        x-small
        :color="hasAppliedAdvancedFilters ? 'primary' : undefined"
        depressed
        @click="showAdvancedFilters = !showAdvancedFilters"
      >
        <v-icon small>tune</v-icon>
      </v-btn>
    </div>

    <filters-advanced
      v-if="showAdvancedFilters"
      class="d-flex flex-column flex-gap-16"
      :value="advancedOptions"
      :rules="advancedFilterRules"
      :behaviours="advancedFiltersBehaviours"
      @input="onAdvancedOptionsChange"
    />
  </div>

  <div v-else-if="isTypeRanged" class="d-flex flex-column flex-fill flex-gap-16">
    <span>{{ definition.label }}</span>

    <filter-money-range v-if="definition.type === 'money-range'" v-model="filter" />
    <filter-number-range v-if="definition.type === 'range'" v-model="filter" />
    <filter-date-range v-else-if="definition.type === 'date'" v-model="filter" />
  </div>

  <switch-field v-else-if="definition.type === 'boolean'" v-model="filter" class="ma-0" :label="definition.label" />
</template>

<script lang="ts">
import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { detectEmptyValueFilter, detectRule, getEmptyValueFilter } from '@/libs/tables/filters'
import FilterArray from './FilterArray.vue'
import FilterDateRange from '@/components/tables/filters/FilterDateRange.vue'
import FilterMoneyRange from '@/components/tables/filters/FilterMoneyRange.vue'
import FilterNumberRange from '@/components/tables/filters/FilterNumberRange.vue'
import FilterSelectMultiple from '@/components/tables/filters/FilterSelectMultiple.vue'
import FilterText from '@/components/tables/filters/FilterText.vue'
import FiltersAdvanced from './advanced/FiltersAdvanced.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import dotProp from 'dot-prop'
import type { AdvancedFilters, Filter, FilterDefinition } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterGridInput',

  components: {
    FilterArray,
    FiltersAdvanced,
    FilterSelectMultiple,
    FilterMoneyRange,
    FilterText,
    SwitchField,
    FilterDateRange,
    FilterNumberRange
  },

  props: {
    value: {
      type: Object as PropType<Filter>,
      default: () => ({})
    },
    definition: {
      type: Object as PropType<FilterDefinition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const showAdvancedFilters = ref(false)

    const advancedOptions = ref<AdvancedFilters>({
      rule: detectRule((props.value || {})[`${props.definition.code}`]),
      behaviour: detectEmptyValueFilter((props.value || {})[`${props.definition.code}`])
    })

    const isTypeRanged = computed(() => ['date', 'range', 'money-range'].includes(props.definition.type))
    const isTypeCustomizable = computed(() => ['text', 'select-multiple', 'array'].includes(props.definition.type))

    const filter = computed({
      get: () => {
        const code = `${props.definition.code}`
        const rule = detectRule((props.value || {})[code])
        const path = rule && !isTypeRanged.value ? `${code}.${rule}` : code
        return dotProp.get(props.value || {}, path)
      },
      set: (value) => {
        const code = `${props.definition.code}`

        const filterValue = value || getEmptyValueFilter(advancedOptions.value.behaviour)

        if (filterValue === undefined) {
          emit('input', { ...props.value, [code]: undefined })
          return
        }

        emit('input', { ...props.value, [code]: filterValue })
      }
    })

    const hasAppliedAdvancedFilters = computed(() => {
      return advancedOptions.value.rule || advancedOptions.value.behaviour !== FilterEmptyValuesEnums.UNDEFINED
    })

    const advancedFilterRules = computed(() => {
      if (['text', 'select-multiple'].includes(props.definition.type)) {
        return ['eq', 'neq']
      }
      if (props.definition.type === 'array') {
        return ['like', 'all']
      }
      return []
    })

    const advancedFiltersBehaviours = computed((): FilterEmptyValuesEnums[] => {
      if (['text', 'select-multiple'].includes(props.definition.type)) {
        return [FilterEmptyValuesEnums.UNDEFINED, FilterEmptyValuesEnums.NULL]
      }

      if (props.definition.type === 'array') {
        return [FilterEmptyValuesEnums.UNDEFINED, FilterEmptyValuesEnums.NULL, FilterEmptyValuesEnums.EMPTY_ARRAY]
      }
      return []
    })

    const onAdvancedOptionsChange = (value: AdvancedFilters) => {
      advancedOptions.value = value
      const { rule, behaviour } = value

      if (filter.value === undefined && behaviour === FilterEmptyValuesEnums.UNDEFINED) {
        filter.value = undefined
        return
      }

      const hasFilledArray = Array.isArray(filter.value) && filter.value.length

      const filterValue = hasFilledArray ? filter.value : getEmptyValueFilter(behaviour)
      filter.value = rule ? { [rule]: filterValue } : filterValue
    }

    return {
      isTypeRanged,
      isTypeCustomizable,
      advancedOptions,
      filter,
      showAdvancedFilters,
      hasAppliedAdvancedFilters,
      advancedFilterRules,
      advancedFiltersBehaviours,
      onAdvancedOptionsChange
    }
  }
})
</script>
