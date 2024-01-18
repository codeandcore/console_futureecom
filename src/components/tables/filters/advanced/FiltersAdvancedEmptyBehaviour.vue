<template>
  <v-select
    v-model="behaviour"
    :label="$t('On empty input')"
    :items="searchBehaviourOptions"
    item-text="text"
    item-value="value"
    outlined
    dense
    hide-details
  />
</template>

<script lang="ts">
import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { AdvancedFilters } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersAdvancedEmptyValue',

  props: {
    value: {
      type: Object as PropType<AdvancedFilters>,
      required: true
    },
    options: {
      type: Array as PropType<FilterEmptyValuesEnums[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const searchBehaviourOptions = computed(() => {
      const behaviours = [
        { text: t('Do not search value'), value: FilterEmptyValuesEnums.UNDEFINED },
        { text: t('Search null'), value: FilterEmptyValuesEnums.NULL },
        { text: t('Search empty array'), value: FilterEmptyValuesEnums.EMPTY_ARRAY }
      ]

      return behaviours.filter((item) => props.options.includes(item.value))
    })

    const behaviour = computed({
      get: () => props.value.behaviour,
      set: (behaviour) => emit('input', { ...props.value, behaviour })
    })

    return {
      behaviour,
      searchBehaviourOptions
    }
  }
})
</script>
