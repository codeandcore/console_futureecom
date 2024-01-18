<template>
  <v-text-field
    v-bind="$attrs"
    v-model="maximum_applicable_items"
    type="number"
    :label="$t('Maximum applicable items')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionTargetConditionMaximumApplicableItems',

  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const maximum_applicable_items = computed({
      get: () => props.value.maximum_applicable_items,
      set: (maximum_applicable_items) => emit('input', { ...props.value, maximum_applicable_items })
    })

    return {
      maximum_applicable_items
    }
  }
})
</script>
