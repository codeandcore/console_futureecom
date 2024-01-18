<template>
  <div>
    <div v-if="!hasCondition" class="d-flex justify-space-between">
      <span>{{ $t('No conditions applied ') }}</span>
      <promotion-condition-actions
        class="d-flex justify-end"
        hide-subset
        @addGroup="addGroup"
        @addChild="condition = $event"
      />
    </div>

    <template v-else>
      <promotion-condition-simple-query
        v-if="simpleQueryCondition"
        v-model="condition"
        @onDelete="condition = undefined"
      />

      <promotion-conditions-query
        v-else
        v-model="condition"
        class="ms-4 mt-0 pt-0"
        stripe-color="transparent"
        @onDelete="condition = null"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PromotionConditionActions from '@/components/domains/coupons/actions/PromotionConditionActions.vue'
import PromotionConditionSimpleQuery from '@/components/domains/coupons/condition/PromotionConditionSimpleQuery.vue'
import PromotionConditionsQuery from '@/components/domains/coupons/condition/PromotionConditionsQuery.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponConditions',
  components: {
    PromotionConditionSimpleQuery,
    PromotionConditionsQuery,
    PromotionConditionActions
  },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const condition = computed({
      get: () => structuredClone(props.value.condition),
      set: (condition) => emit('input', { ...props.value, condition })
    })

    const addGroup = (): void => {
      condition.value = {
        logicalOperator: 'All',
        subsets: [],
        children: []
      }
    }

    const simpleQueryCondition = computed((): boolean => {
      return !condition.value || !('children' in condition.value || 'subset' in condition.value)
    })

    const hasCondition = computed((): boolean => (condition.value ? !!Object.keys(condition.value).length : false))

    return {
      condition,
      addGroup,
      hasCondition,
      simpleQueryCondition
    }
  }
})
</script>
