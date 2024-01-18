<template>
  <div class="d-flex flex-gap-16" data-cy="sales-report-sort-by">
    <sales-report-sort-by-option
      :value="sort"
      :items="items"
      :error-messages="errors['option']"
      data-cy="sales-report-sort-by-input-option"
      @input="onSortUpdate"
    />
    <sales-report-sort-by-totals
      v-if="isSummaryView"
      :disabled="!sort.option"
      :value="sort"
      :error-messages="errors['total']"
      data-cy="sales-report-sort-by-input-totals"
      @input="onSortUpdate"
    />
    <sales-report-sort-by-direction
      :value="sort"
      :error-messages="errors['direction']"
      data-cy="sales-report-sort-by-input-direction"
      @input="onSortUpdate"
    />
  </div>
</template>

<script lang="ts">
import { ReportViewTypeEnum } from '@/types/reports/SaleReport'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { splitReportSort } from '@/libs/domains/report/formatters'
import { useValidator } from '@/composable/validator/useValidator'
import SalesReportSortByDirection from '@/components/domains/reports/queryInputs/sort/SalesReportSortByDirection.vue'
import SalesReportSortByOption from '@/components/domains/reports/queryInputs/sort/SalesReportSortByOption.vue'
import SalesReportSortByTotals from '@/components/domains/reports/queryInputs/sort/SalesReportSortByTotals.vue'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'
import type { SaleReportExtendedGridRequest, SaleReportSortByParts } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportSortBy',

  components: { SalesReportSortByOption, SalesReportSortByTotals, SalesReportSortByDirection },

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    },
    items: {
      type: Array as PropType<string[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const isSummaryView = computed(() => props.value.reportViewType === ReportViewTypeEnum.SUMMARY)

    const setSort = (val?: string[]): SaleReportSortByParts => {
      const { separator, split } = splitReportSort((val || [])[0] || '')
      const [prefix, total] = split

      const sort = {
        direction: (prefix || '').includes('-') ? '-' : '',
        option: (prefix || '').replaceAll('-', '')
      }

      return separator ? { ...sort, total: total ? `${separator}.${total}` : separator } : sort
    }

    const sort = ref<SaleReportSortByParts>(setSort(props.value.sort))

    const { errors, validate, isValid } = useValidator(sort.value)

    const rules = computed((): RuleDefinitions => {
      return {
        direction: ['string'],
        option: ['required'],
        total: props.value.reportViewType === ReportViewTypeEnum.SUMMARY ? ['required'] : []
      }
    })

    const onSortUpdate = (val: SaleReportSortByParts) => {
      sort.value = { ...val }

      if (!sort.value.option) {
        emit('input', { ...props.value, sort: undefined })
        return
      }

      validate(sort.value, rules.value, true)

      if (isValid.value) {
        const sortPrefix = `${sort.value.direction}${sort.value.option}`
        const stringifiedSort = sort.value.total ? `${sortPrefix}.${sort.value.total}` : sortPrefix

        emit('input', { ...props.value, sort: [stringifiedSort] })
      }
    }

    return {
      sort,
      errors,
      isSummaryView,
      onSortUpdate
    }
  }
})
</script>
