<template>
  <coupon-condition-subset-inputs v-model="subsetValue" :type="subsetRule" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CouponConditionSubsetInputs from '@/components/domains/coupons/inputs/CouponConditionSubsetInputs.vue'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionTargetConditionSubset',
  components: { CouponConditionSubsetInputs },
  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const subsetValue = computed({
      get: () => props.value.subset.value,
      set: (value) => emit('input', { ...props.value, subset: { ...props.value.subset, value } })
    })

    const subsetRule = computed(() => (props.value.subset ? props.value.subset.rule : undefined))

    return {
      subsetValue,
      subsetRule
    }
  }
})
</script>
