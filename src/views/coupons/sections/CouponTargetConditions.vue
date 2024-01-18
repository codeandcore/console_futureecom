<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-gap-16">
      <span class="d-block text-caption">
        {{ $t('Target condition determines on what kind of products the campaign affects') }}
      </span>

      <promotion-add-target-action :value="value" @onSelect="addTarget" />
    </div>

    <div v-for="(targetCondition, index) in target_condition" :key="targetCondition.subset.rule">
      <v-divider />

      <coupon-target-condition-inputs :value="targetCondition" @input="updateTarget(index, $event)">
        <template #after-icon>
          <v-btn depressed icon @click="removeTarget(targetCondition.subset.rule)">
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </coupon-target-condition-inputs>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CouponTargetConditionInputs from '@/components/domains/coupons/inputs/CouponTargetConditionInputs.vue'
import PromotionAddTargetAction from '@/components/domains/coupons/actions/PromotionAddTargetAction.vue'
import type {
  Promotion,
  PromotionTargetCondition,
  PromotionTargetType
} from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponTargetConditions',
  components: { PromotionAddTargetAction, CouponTargetConditionInputs },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const target_condition = computed({
      get: () => structuredClone(props.value.target_condition || []),
      set: (target_condition) => emit('input', { ...props.value, target_condition })
    })

    const addTarget = (rule: PromotionTargetType): void => {
      target_condition.value = [
        ...target_condition.value,
        {
          included: true,
          subset: {
            type: 'checkbox',
            name: 'items',
            rule,
            selectedOperator: '=',
            value: []
          }
        }
      ]
    }

    const updateTarget = (index: number, value: PromotionTargetCondition): void => {
      target_condition.value[index] = value
      target_condition.value = [...target_condition.value]
    }

    const removeTarget = (rule: string): void => {
      target_condition.value = target_condition.value.filter((item) => item.subset.rule !== rule)
    }

    return {
      target_condition,
      addTarget,
      updateTarget,
      removeTarget
    }
  }
})
</script>
