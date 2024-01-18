<template>
  <div>
    <shippo-fee-type v-model="fee" :rules="rules.typeRule" />
    <shippo-fee-amount :key="fee.type" v-model="fee" :rules="rules.amountRule" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useMatchRangeValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import ShippoFeeAmount from '@/components/domains/settings/plugins/shippo/fee/ShippoFeeAmount.vue'
import ShippoFeeType from '@/components/domains/settings/plugins/shippo/fee/ShippoFeeType.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'ShippoFee',
  components: { ShippoFeeAmount, ShippoFeeType },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const fee = computed({
      get: () => props.value.fee,
      set: (fee) => emit('input', { ...props.value, fee })
    })

    const rules = computed(() => {
      const required = [
        (amount: string | number) => (typeof amount === 'string' ? useNotEmptyValidationRule(amount) : true)
      ]
      const amountRule: ((...args: any) => ValidationRule)[] = [...required]

      if (fee.value.type === 'percent') {
        amountRule.push((amount: number) => useMatchRangeValidationRule(amount, 0, 100))
      }

      return { typeRule: required, amountRule }
    })

    return {
      fee,
      rules
    }
  }
})
</script>
