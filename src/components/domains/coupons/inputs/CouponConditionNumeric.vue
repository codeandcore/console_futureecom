<template>
  <div>
    <v-select
      class="me-4"
      :label="$t('Operator')"
      outlined
      :items="numericOperators"
      item-text="name"
      item-value="code"
      :value="value.selectedOperator"
      hide-details
      @input="$emit('input', { ...value, selectedOperator: $event })"
    />
    <v-text-field
      :label="$t('Value')"
      outlined
      :value="value.value"
      hide-details
      @input="$emit('input', { ...value, value: $event })"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PromotionConditionQuerySimple } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditionNumeric',

  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    }
  },

  setup() {
    return {
      numericOperators: ['>', '<', '=', '<>', '<=', '>=']
    }
  }
})
</script>
