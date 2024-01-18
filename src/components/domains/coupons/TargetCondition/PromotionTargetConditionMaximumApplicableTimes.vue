<template>
  <v-text-field
    v-bind="$attrs"
    v-model="maximum_applicable_times"
    type="number"
    :label="$t('Maximum applicable times')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionTargetConditionMaximumApplicableTimes',

  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const maximum_applicable_times = computed({
      get: () => props.value.maximum_applicable_times,
      set: (maximum_applicable_times) => emit('input', { ...props.value, maximum_applicable_times })
    })

    return {
      maximum_applicable_times
    }
  }
})
</script>
