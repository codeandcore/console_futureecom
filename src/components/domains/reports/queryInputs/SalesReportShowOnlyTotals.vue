<template>
  <switch-field v-model="totalsOnly" :label="$t('Show only totals')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { isTruthy } from '@/libs/boolean'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { SaleReportExtendedGridRequest } from '@/types/reports/SaleReport'

export default defineComponent({
  name: 'SalesReportShowOnlyTotals',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<SaleReportExtendedGridRequest>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const totalsOnly = computed({
      get: () => isTruthy(props.value.totalsOnly),
      set: (totalsOnly) => emit('input', { ...props.value, totalsOnly })
    })

    return {
      totalsOnly
    }
  }
})
</script>
