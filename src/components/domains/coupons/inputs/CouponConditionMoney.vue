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
    <money-amount-field v-model="money" :label="$t('Amount')" outlined hide-details />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import MoneyAmountField from '@/components/common/MoneyAmountField.vue'
import type { Money } from '@futureecom/futureecom-js'
import type { PromotionConditionQuerySimple } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditionMoney',
  components: { MoneyAmountField },

  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    }
  },

  setup(props, { emit }) {
    const money = computed({
      get: (): Money | null => (props.value.value !== null ? { amount: `${props.value.value}`, currency: '' } : null),
      set: (val: Money | null) => emit('input', { ...props.value, value: val === null ? null : val.amount })
    })

    return {
      money,
      numericOperators: ['>', '<', '=', '<>', '<=', '>=']
    }
  }
})
</script>
