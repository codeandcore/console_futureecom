<template>
  <div data-cy="table-pagination-controls">
    <rtl-chevron-icon
      data-cy="table-pagination-controls-first-page"
      reversed
      doubled
      :disabled="page === 1"
      @click="page = 1"
    />
    <rtl-chevron-icon
      data-cy="table-pagination-controls-previous-page"
      reversed
      :disabled="!canGoToPreviousPage"
      @click="page -= 1"
    />
    <div class="text-caption d-flex align-center flex-gap-8">
      <v-text-field
        v-maska:[options]
        :value="page"
        hide-details
        dense
        :style="{ width: '60px' }"
        class="align-to-center-input"
        outlined
        single-line
        data-cy="table-pagination-controls-current-page-input"
        @change="onPageChange"
      />
      <span>{{ $t('of') }}</span>
      <span data-cy="table-pagination-controls-meta-last-page">{{ meta.last_page || 1 }}</span>
    </div>
    <rtl-chevron-icon data-cy="table-pagination-controls-next-page" :disabled="!canGoToNextPage" @click="page += 1" />
    <rtl-chevron-icon
      data-cy="table-pagination-controls-last-page"
      doubled
      :disabled="page === meta.last_page"
      @click="page = meta.last_page || 1"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useDebounceFn } from '@vueuse/core'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import type { PropType } from '@vue/composition-api'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'TableNextPreviousPage',

  components: { RtlChevronIcon },

  props: {
    meta: {
      type: Object as PropType<Partial<ResponseCollection<any>['meta']>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const page = computed({
      get: () => Number(props.meta?.current_page) || 1,
      set: (page) => emit('input', { page: Number(page) })
    })

    const canGoToNextPage = computed(() => page.value + 1 <= (props.meta.last_page || 0))
    const canGoToPreviousPage = computed(() => page.value - 1 >= 1)

    const onPageChange = useDebounceFn((val) => (page.value = val), 700)

    const options = {
      postProcess: (val: string | number): number => {
        const parsedInt = Number(val) || 1

        if (props.meta.last_page && parsedInt > props.meta.last_page) {
          return props.meta.last_page
        }

        return parsedInt <= 1 ? 1 : parsedInt
      }
    }

    return {
      page,
      options,
      canGoToNextPage,
      canGoToPreviousPage,
      onPageChange
    }
  }
})
</script>
<style scoped>
.align-to-center-input >>> input {
  text-align: center;
}
</style>
