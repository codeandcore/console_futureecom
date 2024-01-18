<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="percentage"
    outlined
    :label="$t('Percentage')"
    type="number"
    prefix="%"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { RecalculateCommission } from '@futureecom/futureecom-js/dist/services/commission-service'

export default defineComponent({
  name: 'CommissionPercentage',

  props: {
    value: {
      type: Object as PropType<RecalculateCommission>,
      required: true
    }
  },

  setup(props, { emit }) {
    const percentage = computed({
      get: () => props.value.percentage,
      set: (percentage) => emit('input', { ...props.value, percentage })
    })

    return {
      percentage
    }
  }
})
</script>
