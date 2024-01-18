<template>
  <div>
    <promotion-name v-model="promotion" class="required" :rules="rules.name" />
    <promotion-description v-model="promotion" class="required" :rules="rules.description" />
    <div class="d-flex flex-gap-16">
      <promotion-rate-type v-model="promotion" />
      <promotion-rate-value v-model="promotion" class="required" :rules="rules.value" />
    </div>
    <promotion-type v-model="promotion" />

    <v-scroll-y-transition mode="out-in">
      <div v-if="isCoupon" class="d-flex flex-column justify-center flex-gap-16">
        <promotion-code v-model="promotion" class="required" :rules="rules.code" :label="$t('Discount code')" />
        <promotion-max-customer-uses v-model="promotion" />
        <promotion-max-total-uses v-model="promotion" />
      </div>
    </v-scroll-y-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useMatchRangeValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import CodeInput from '@/components/foundation/CodeInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import PromotionDescription from '@/components/domains/coupons/PromotionDescription.vue'
import PromotionMaxCustomerUses from '@/components/domains/coupons/PromotionMaxCustomerUses.vue'
import PromotionMaxTotalUses from '@/components/domains/coupons/PromotionMaxTotalUses.vue'
import PromotionRateType from '@/components/domains/coupons/PromotionRateType.vue'
import PromotionRateValue from '@/components/domains/coupons/PromotionRateValue.vue'
import PromotionType from '@/components/domains/coupons/PromotionType.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationFunction, ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CouponDetails',
  components: {
    PromotionName: NameInput,
    PromotionMaxTotalUses,
    PromotionMaxCustomerUses,
    PromotionCode: CodeInput,
    PromotionType,
    PromotionRateValue,
    PromotionRateType,
    PromotionDescription
  },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const promotion = computed({
      get: (): Promotion => props.value,
      set: (promotion) => emit('input', promotion)
    })

    const isCoupon = computed((): boolean => props.value.type === 'coupon')

    const rules = computed(() => {
      const value: ValidationFunction[] = [(value: string): ValidationRule => useNotEmptyValidationRule(value)]
      if (promotion.value.rate_type === 'percentage') {
        value.push((value: number): ValidationRule => useMatchRangeValidationRule(value, 0, 100))
      }

      return {
        code: [(code: string): ValidationRule => useNotEmptyValidationRule(code)],
        description: [(description: string): ValidationRule => useNotEmptyValidationRule(description)],
        name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
        value
      }
    })

    return {
      isCoupon,
      promotion,
      rules
    }
  }
})
</script>
