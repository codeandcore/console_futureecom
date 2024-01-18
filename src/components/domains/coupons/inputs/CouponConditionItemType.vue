<template>
  <div>
    <span class="me-4">{{ $t('is') }}:</span>
    <v-select
      :label="$t('Value')"
      outlined
      :items="[
        { name: 'Digital', code: 'digital' },
        { name: 'Physical', code: 'physical' },
        { name: 'Service', code: 'service' }
      ]"
      :rules="rules"
      item-text="name"
      item-value="code"
      :value="value.value"
      hide-details="auto"
      @input="$emit('input', { ...value, selectedOperator: '=', value: $event })"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import type { PromotionConditionQuerySimple } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CouponConditionItemType',

  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    }
  },

  setup() {
    const rules = [(val: string): ValidationRule => useNotEmptyValidationRule(val)]

    return {
      rules
    }
  }
})
</script>
