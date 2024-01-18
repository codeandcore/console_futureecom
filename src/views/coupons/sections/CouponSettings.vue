<template>
  <div class="d-flex flex-column">
    <promotion-exclusive v-model="promotion" />
    <promotion-active v-model="promotion" />
    <promotion-target v-model="promotion" />
    <promotion-priority v-model="promotion" class="required" :rules="rules.priority" />

    <span class="mt-2">{{ $t('Start date') }}</span>
    <promotion-start-date v-model="promotion" class="d-flex flex-grow-1" />

    <span>{{ $t('End date') }}</span>
    <promotion-end-date v-model="promotion" class="d-flex flex-grow-1" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import PromotionActive from '@/components/domains/coupons/PromotionActive.vue'
import PromotionEndDate from '@/components/domains/coupons/PromotionEndDate.vue'
import PromotionExclusive from '@/components/domains/coupons/PromotionExclusive.vue'
import PromotionPriority from '@/components/domains/coupons/PromotionPriority.vue'
import PromotionStartDate from '@/components/domains/coupons/PromotionStartDate.vue'
import PromotionTarget from '@/components/domains/coupons/PromotionTarget.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CouponSettings',
  components: {
    PromotionEndDate,
    PromotionStartDate,
    PromotionPriority,
    PromotionTarget,
    PromotionActive,
    PromotionExclusive
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

    const rules = {
      priority: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    return {
      promotion,
      rules
    }
  }
})
</script>
