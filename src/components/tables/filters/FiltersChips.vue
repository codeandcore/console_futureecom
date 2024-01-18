<template>
  <div class="d-flex flex-wrap" data-cy="filter-chips">
    <v-slide-y-reverse-transition v-for="(val, index) in convertedToChip" :key="`${index}-${val.code}`" mode="out-in">
      <v-chip v-if="val.value !== undefined" class="me-2 mt-2" data-cy="filter-chip-item">
        <span :data-cy="`filter-chip-label-${val.code}`">{{ val.label }}</span>
        <v-icon class="mx-2">arrow_right_alt</v-icon>

        <gte-lte-range
          v-if="isRange(val.type)"
          :value="val.value"
          :type="val.type"
          :data-cy="`filter-chip-range-${val.code}`"
        />

        <span v-else :data-cy="`filter-chip-value-${val.code}`">{{ val.value }}</span>

        <v-divider vertical class="mx-2" />

        <v-icon size="16" :data-cy="`filter-chip-delete-${val.code}`" @click="deleteChip(`${val.code}`)">close</v-icon>
      </v-chip>
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { isEmptyObject } from '@/libs/objects'
import { transformToValuedFilterDefinition } from '@/libs/tables/filters'
import GteLteRange from '@/components/tables/filters/GteLteRange.vue'
import type {
  FilterChip,
  FilterDefinition,
  FilterRangeType,
  FilterSelectType,
  FilterTextType
} from '@/types/FilterDefinitions'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersChips',
  components: { GteLteRange },

  props: {
    value: {
      type: Object as PropType<GridRequest | undefined>,
      default: () => undefined
    },
    definitions: {
      type: Array as PropType<FilterDefinition[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const convertedToChip = computed((): FilterDefinition[] => {
      return Object.entries(props.value?.filter || {}).map<FilterChip>((val) => {
        return transformToValuedFilterDefinition(val, props.definitions)
      })
    })

    const deleteChip = (code: string): void => {
      const { [code]: _, ...rest } = props.value?.filter || {}
      emit('input', { ...props.value, filter: !isEmptyObject(rest) ? rest : undefined, page: 1 })
    }

    const isRange = (type: FilterTextType | FilterSelectType): type is FilterRangeType => {
      return ['date', 'range', 'money-range'].includes(type)
    }

    return {
      convertedToChip,
      isRange,
      deleteChip
    }
  }
})
</script>
