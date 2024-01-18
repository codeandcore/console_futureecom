<template>
  <scrollable data-cy="grid-layout">
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <div class="d-flex flex-column" data-cy="grid-layout-title">
            <slot name="title">
              <span>{{ title }}</span>
            </slot>
            <slot name="subtitle" />
          </div>
          <slot name="actions" />
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <slot name="scrollable.content.top" />
        <div data-cy="grid-layout-resources-grid">
          <resource-grid
            v-bind="{
              value: gridParams,
              options: gridOptions,
              items: grid.data,
              selectedItems,
              hideDefaultFooter: true,
              ...gridProps
            }"
            @onParamsChange="gridParams = $event"
            @update:selectedItems="$emit('update:selected-items', $event)"
          >
            <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
              <slot :name="name" v-bind="slotData || {}" />
            </template>
          </resource-grid>
        </div>
        <v-divider />
        <div v-if="!heightExceeded" :class="footerClasses" data-cy="grid-layout-non-sticky-bottom">
          <slot name="grid.footer.actions" />
          <slot name="grid.footer.pagination">
            <table-pagination v-if="grid.meta" v-model="gridParams" :meta="grid.meta" />
          </slot>
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <div v-if="heightExceeded" data-cy="grid-layout-sticky-bottom">
        <v-divider />
        <v-footer :class="footerClasses">
          <slot name="grid.footer.actions" />
          <slot name="grid.footer.pagination">
            <table-pagination v-if="grid.meta" v-model="gridParams" :meta="grid.meta" />
          </slot>
        </v-footer>
      </div>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { GridRequest } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'GridLayout',

  components: { TablePagination, Scrollable, ResourceGrid },

  props: {
    title: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    params: {
      type: Object as PropType<GridRequest>,
      required: true
    },
    options: {
      type: Object as PropType<ResourceGridOptions>,
      required: true
    },
    grid: {
      type: Object as PropType<Grid>,
      required: true
    },
    gridProps: {
      type: Object,
      default: () => ({})
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },

  emits: {
    paramsChanged: (_: GridRequest) => true,
    selected: () => true
  },

  setup(props, { emit, slots }) {
    const gridParams = computed({
      get: () => props.params,
      set: (params) => {
        // TODO: remove flag after introducing custom tables.
        // The flag prevents double-emits caused by Vuetify's event emitter event on (unnecessary for us) external change.
        // Similar issue: https://github.com/vuetifyjs/vuetify/issues/11130
        if (!props.grid.loading) {
          emit('paramsChanged', params)
        }
      }
    })

    const footerClasses = computed(() => [
      'd-flex',
      'align-center pa-4',
      'flex-gap-16',
      slots['grid.footer.actions'] ? 'justify-space-between' : 'justify-end'
    ])

    const gridOptions = computed(() => ({
      ...props.options,
      loading: props.grid.loading,
      meta: props.grid.meta
    }))

    return {
      footerClasses,
      gridOptions,
      gridParams
    }
  }
})
</script>
