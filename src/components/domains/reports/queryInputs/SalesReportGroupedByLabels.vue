<template>
  <div>
    <span v-if="isNullish">{{ $t('N/A') }}</span>
    <span v-else-if="isSimple">
      {{ formatCodeToHumanText(`${groups}`).replaceAll(',', ', ') }}:
      {{ `${groupedBy}`.replaceAll(',', ', ') || $t('N/A') }}
    </span>
    <span v-else class="d-flex flex-column flex-gap-4">
      <template v-for="(value, key) in groupedBy">
        <span :key="key">
          {{ formatCodeToHumanText(key) }}:
          {{ value === '' || `${value}` === 'null' ? $t('N/A') : `${value}`.replaceAll(',', ', ') }}
        </span>
      </template>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { formatCodeToHumanText } from '@/libs/domains/report/formatters'
import { isItemGroupedBySimple } from '@/libs/domains/report/guards'
import type { PropType } from '@vue/composition-api'
import type { SalesReportGroupedBy } from '@futureecom/futureecom-js/dist/services/order-service'

export default defineComponent({
  name: 'SalesReportGroupedByLabels',

  props: {
    groupedBy: {
      type: [] as PropType<SalesReportGroupedBy>,
      required: true
    },
    groups: {
      type: [String, Array] as PropType<string | unknown[]>,
      default: () => []
    }
  },

  setup(props) {
    const isNullish = computed(() => ['null', ''].some((item) => item === `${props.groups}`))

    const isSimple = computed(() => isItemGroupedBySimple(props.groupedBy))

    return {
      isNullish,
      isSimple,
      formatCodeToHumanText
    }
  }
})
</script>
