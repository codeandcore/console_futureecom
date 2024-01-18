<template>
  <coupon-condition-item-type v-if="type === 'items.*.type'" v-model="conditionValue" />
  <coupon-condition-text v-else-if="type === 'shipping_address.administrative_area'" v-model="conditionValue" />
  <coupon-condition-money v-else-if="type === 'summary.total_items_amount.amount'" v-model="conditionValue" />
  <coupon-condition-numeric
    v-else-if="['summary.total_items_count', 'items.*.quantity'].includes(type)"
    v-model="conditionValue"
  />
  <coupon-condition-item-text
    v-else-if="['items.*.sku', 'items.*.brand', 'items.*.name'].includes(type)"
    v-model="conditionValue"
    :type="type"
  />
  <div v-else>
    <span>{{ $t('Unknown rule') }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CouponConditionItemText from '@/components/domains/coupons/inputs/CouponConditionItemText.vue'
import CouponConditionItemType from '@/components/domains/coupons/inputs/CouponConditionItemType.vue'
import CouponConditionMoney from './CouponConditionMoney.vue'
import CouponConditionNumeric from '@/components/domains/coupons/inputs/CouponConditionNumeric.vue'
import CouponConditionText from '@/components/domains/coupons/inputs/CouponConditionText.vue'
import type {
  PromotionConditionQuerySimple,
  PromotionConditionRule
} from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditionSimpleQueryInputs',
  components: {
    CouponConditionMoney,
    CouponConditionNumeric,
    CouponConditionItemText,
    CouponConditionText,
    CouponConditionItemType
  },
  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    },
    type: {
      type: String as PropType<PromotionConditionRule>,
      required: true
    }
  },

  setup(props, { emit }) {
    const conditionValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      conditionValue
    }
  }
})
</script>
