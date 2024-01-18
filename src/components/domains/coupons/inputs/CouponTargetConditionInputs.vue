<template>
  <v-list>
    <v-list-group v-model="expanded" no-action append-icon color="">
      <v-list-item-content slot="activator">
        <v-list-item-title class="d-flex justify-space-between align-center">
          <div class="d-flex flex-column">
            <promotion-target-condition-preview :value="targetCondition" />
            <rule-validator :value="targetCondition.subset.value" :rules="rules.subsetValue" />
          </div>
          <div>
            <v-icon class="mx-4">
              {{ expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </v-icon>
            <slot name="after-icon" />
          </div>
        </v-list-item-title>
      </v-list-item-content>
      <slot name="content">
        <div class="mx-4 d-flex flex-column flex-gap-16">
          <promotion-target-condition-included v-model="targetCondition" />
          <div class="d-flex flex-gap-16">
            <promotion-target-condition-maximum-applicable-items v-model="targetCondition" />
            <promotion-target-condition-maximum-applicable-times v-model="targetCondition" />
          </div>
          <rule-validator :value="targetCondition.subset.value" :rules="rules.subsetValue" />
          <promotion-target-condition-subset v-model="targetCondition" />
        </div>
      </slot>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useNotEmptyArrayValidationRule } from '@/composable/validationRules'
import PromotionTargetConditionIncluded from '@/components/domains/coupons/TargetCondition/PromotionTargetConditionIncluded.vue'
import PromotionTargetConditionMaximumApplicableItems from '@/components/domains/coupons/TargetCondition/PromotionTargetConditionMaximumApplicableItems.vue'
import PromotionTargetConditionMaximumApplicableTimes from '@/components/domains/coupons/TargetCondition/PromotionTargetConditionMaximumApplicableTimes.vue'
import PromotionTargetConditionPreview from '@/components/domains/coupons/TargetCondition/PromotionTargetConditionPreview.vue'
import PromotionTargetConditionSubset from '@/components/domains/coupons/TargetCondition/PromotionTargetConditionSubset.vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CouponTargetConditionInputs',

  components: {
    RuleValidator,
    PromotionTargetConditionSubset,
    PromotionTargetConditionMaximumApplicableTimes,
    PromotionTargetConditionMaximumApplicableItems,
    PromotionTargetConditionIncluded,
    PromotionTargetConditionPreview
  },
  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const expanded = ref(true)

    const targetCondition = computed({
      get: (): PromotionTargetCondition => props.value,
      set: (value) => emit('input', value)
    })

    const rules = {
      subsetValue: [(value: string[]): ValidationRule => useNotEmptyArrayValidationRule(value)]
    }

    return {
      expanded,
      targetCondition,
      rules
    }
  }
})
</script>
