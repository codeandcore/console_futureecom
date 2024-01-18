<template>
  <div class="d-flex flex-gap-16 align-center shrink justify-end" data-cy="table-pagination">
    <table-rows-per-page v-model="pagination" :meta="meta" :style="{ width: '120px' }" />
    <v-divider vertical />
    <table-pagination-controls v-model="pagination" :meta="meta" class="d-flex align-center flex-gap-4" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TablePaginationControls from '@/components/tables/pagination/TablePaginationControls.vue'
import TableRowsPerPage from '@/components/tables/pagination/TableRowsPerPage.vue'
import type { PropType } from '@vue/composition-api'
import type { GridRequest, ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'TablePagination',

  components: { TableRowsPerPage, TablePaginationControls },

  props: {
    value: {
      type: Object as PropType<GridRequest>,
      required: true
    },
    meta: {
      type: Object as PropType<Partial<ResponseCollection<any>['meta']>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const pagination = computed({
      get: () => props.value,
      set: (val) => emit('input', { ...props.value, ...val })
    })

    return {
      pagination
    }
  }
})
</script>
