<template>
  <div>
    <v-select
      class="me-4"
      :label="$t('operator')"
      outlined
      :items="textOperators"
      item-text="name"
      item-value="code"
      :value="value.selectedOperator"
      hide-details
      @input="$emit('input', { ...value, selectedOperator: $event, value: '' })"
    />
    <v-text-field outlined :value="value.value" hide-details @input="$emit('input', { ...value, value: $event })" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PromotionConditionQuerySimple } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditionText',

  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    }
  },

  setup() {
    const textOperators = [
      'equals',
      'does not equals',
      'contains',
      'does not contain',
      'is empty',
      'begins with',
      'ends with'
    ]

    return {
      textOperators
    }
  }
})
</script>
