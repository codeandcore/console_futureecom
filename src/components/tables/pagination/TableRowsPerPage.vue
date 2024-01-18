<template>
  <v-select
    v-bind="$attrs"
    v-model="perPage"
    outlined
    dense
    :label="$t('Rows per page')"
    item-text="text"
    item-value="value"
    :items="items"
    hide-details="auto"
    data-cy="table-rows-per-page"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { paginateCollection } from '@/libs/tables/grid'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'TableRowsPerPage',

  props: {
    meta: {
      type: Object as PropType<Partial<ResponseCollection<any>['meta']>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const perPage = computed({
      get: () => Number(props.meta.per_page || 5),
      set: (perPage) => {
        const page = paginateCollection(props.meta.total || 1, props.meta.current_page || 1, perPage).current_page
        emit('input', { perPage, page })
      }
    })

    const items = computed(() => [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '15', value: 15 },
      { text: t('All'), value: -1 }
    ])

    return {
      perPage,
      items
    }
  }
})
</script>
