<template>
  <v-form id="filters-grid" data-cy="filters-grid" @submit.prevent="apply">
    <scrollable height="100vh">
      <template #sticky>
        <v-card flat>
          <v-card-title class="py-2 d-flex justify-space-between">
            <slot name="header">
              <slot name="before-title" />
              <span>{{ $t('Filters') }}</span>
              <v-text-field
                v-model="searchFilter"
                :label="$t('Search for filter')"
                outlined
                dense
                hide-details
                class="ms-16 my-2"
                append-icon="filter_list"
              >
                <slot name="after-title" />
              </v-text-field>
            </slot>
          </v-card-title>
          <v-divider />
        </v-card>
      </template>
      <template #scrollable-content>
        <div class="d-flex flex-column">
          <div v-for="(option, index) in visibleFilters" :key="index">
            <slot :name="`filter.${option.code}`">
              <filter-grid-input v-model="filters" class="pa-3" :definition="option" />
            </slot>
            <slot name="filters" />
            <v-divider />
          </div>
        </div>
      </template>
      <template #sticky-bottom>
        <v-divider />
        <v-card flat class="d-flex justify-space-around mx-0 py-4" data-cy="filters-grid-actions">
          <slot name="actions.before" />
          <slot name="actions">
            <v-btn depressed data-cy="filters-grid-actions-clear" @click="$emit('clear')">
              {{ $t('Clear') }}
            </v-btn>
            <v-btn color="primary" depressed type="submit" data-cy="filters-grid-actions-apply">
              {{ $t('Apply') }}
            </v-btn>
          </slot>
          <slot name="actions.after" />
        </v-card>
      </template>
    </scrollable>
  </v-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import FilterGridInput from './FilterGridInput.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { Filter, FilterDefinition } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FiltersGrid',

  components: {
    FilterGridInput,
    Scrollable
  },

  props: {
    value: {
      type: Object as PropType<Filter>,
      default: () => ({})
    },
    definitions: {
      type: Array as PropType<FilterDefinition[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const searchFilter = ref('')

    const filters = ref<Filter>(structuredClone(props.value))

    const apply = () => emit('apply', removeEmptyFields(filters.value || {}))

    const visibleFilters = computed((): FilterDefinition[] => {
      return props.definitions.filter((option) => option.label.toLowerCase().includes(searchFilter.value.toLowerCase()))
    })

    watch(
      () => props.value,
      () => (filters.value = structuredClone(props.value)),
      { deep: true }
    )

    return {
      searchFilter,
      filters,
      apply,
      visibleFilters
    }
  }
})
</script>
