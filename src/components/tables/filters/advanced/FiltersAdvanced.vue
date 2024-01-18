<template>
  <div>
    <filters-advanced-rules v-if="rules.length" v-model="advancedOptions" :rules="rules" />
    <filters-advanced-empty-behaviour v-model="advancedOptions" :options="behaviours" />
  </div>
</template>

<script lang="ts">
import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import { computed, defineComponent } from '@vue/composition-api'
import FiltersAdvancedEmptyBehaviour from '@/components/tables/filters/advanced/FiltersAdvancedEmptyBehaviour.vue'
import FiltersAdvancedRules from '@/components/tables/filters/advanced/FiltersAdvancedRules.vue'
import type { AdvancedFilters, MathOperator } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersAdvanced',

  components: { FiltersAdvancedRules, FiltersAdvancedEmptyBehaviour },

  props: {
    value: {
      type: Object as PropType<AdvancedFilters>,
      required: true
    },
    rules: {
      type: Array as PropType<(MathOperator | 'like' | 'all')[]>,
      default: () => []
    },
    behaviours: {
      type: Array as PropType<FilterEmptyValuesEnums[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const advancedOptions = computed({
      get: (): AdvancedFilters => props.value,
      set: (value) => emit('input', value)
    })

    return {
      advancedOptions
    }
  }
})
</script>
