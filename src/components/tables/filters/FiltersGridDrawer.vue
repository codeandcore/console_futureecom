<template>
  <portal to="side-drawer">
    <v-slide-x-reverse-transition mode="out-in">
      <v-overlay
        v-if="openFilters"
        :value="openFilters"
        class="d-flex justify-end"
        z-index="500"
        @click="onOutsideClick"
      >
        <div @click.stop>
          <v-card light>
            <filters-grid
              :key="`filters-${Object.keys(currentFilter || {}).length}`"
              :style="{ width: openFilters ? '400px' : '0' }"
              :value="currentFilter"
              :definitions="definitions"
              @apply="onFiltersApplied"
              @clear="onFiltersApplied"
            >
              <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
                <slot :name="`grid.filter.${name}`" v-bind="slotData || {}" />
              </template>
            </filters-grid>
          </v-card>
        </div>
      </v-overlay>
    </v-slide-x-reverse-transition>
  </portal>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import FiltersGrid from '@/components/tables/filters/FiltersGrid.vue'
import type { Filter } from '@/types/FilterDefinitions'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersGridDrawer',

  components: { FiltersGrid },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<GridRequest>,
      default: undefined
    },
    definitions: {
      type: Array as PropType<FilterDefinition[]>,
      default: () => []
    },
    open: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const openFilters = computed({
      get: () => props.open,
      set: (val) => emit('update:open', val)
    })

    const currentFilter = computed({
      get: (): Filter | undefined => props.value?.filter || {},
      set: (filter: Filter | undefined) => emit('input', { ...props.value, filter, page: 1 })
    })

    const onFiltersApplied = (filter?: Filter) => {
      currentFilter.value = filter
      openFilters.value = false
    }

    const onOutsideClick = () => (openFilters.value = false)

    return {
      openFilters,
      currentFilter,
      onFiltersApplied,
      onOutsideClick
    }
  }
})
</script>
