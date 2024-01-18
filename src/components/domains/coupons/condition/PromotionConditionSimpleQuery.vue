<template>
  <expandable-content stripe-color="" stripe-color-on-expand="primary">
    <template #title>
      <div class="d-flex flex-column text-wrap" @click.stop>
        <div class="d-flex flex-column">
          <span>{{ $t(simpleConditionLabels[condition.rule]) }}</span>
          <span v-if="condition.value" class="text-caption grey--text">
            {{ condition.selectedOperator }}
            <span v-if="condition.rule === 'summary.total_items_amount.amount'">
              {{ $format.money.withStoreCurrency({ amount: condition.value, currency: '' }) }}
            </span>
            <span v-else>
              {{ `${condition.value}`.replaceAll(',', ', ') }}
            </span>
          </span>
        </div>
      </div>
    </template>
    <template #after-icon>
      <v-btn icon @click.stop="$emit('onDelete')">
        <v-icon>close</v-icon>
      </v-btn>
    </template>

    <template #content>
      <coupon-condition-simple-query-inputs
        v-if="condition"
        v-model="condition"
        class="mx-6 my-2 d-flex align-center justify-center"
        :type="condition.rule"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CouponConditionSimpleQueryInputs from '@/components/domains/coupons/inputs/CouponConditionSimpleQueryInputs.vue'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import type { PromotionConditionQuerySimple } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionConditionSimpleQuery',
  components: { ExpandableContent, CouponConditionSimpleQueryInputs },
  props: {
    value: {
      type: Object as PropType<PromotionConditionQuerySimple>,
      required: true
    }
  },

  setup(props, { emit }) {
    const condition = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const simpleConditionLabels = {
      'summary.total_items_amount.amount': 'Total items amount',
      'summary.total_items_count': 'Total items count',
      'items.*.sku': 'Item SKU',
      'items.*.name': 'Item name',
      'items.*.brand': 'Item brand',
      'items.*.type': 'Item type',
      'shipping_address.administrative_area': 'Shipping region',
      'items.*.quantity': 'Items quantity'
    }

    return {
      condition,
      simpleConditionLabels
    }
  }
})
</script>
