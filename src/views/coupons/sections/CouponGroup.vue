<template>
  <div>
    <span>{{ $t('Allowed Groups') }} {{ hasSelectedGroups ? '' : '(all)' }}</span>
    <promotion-customer-group v-model="promotion" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PromotionCustomerGroup from '@/components/domains/coupons/PromotionCustomerGroup.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponGroup',
  components: { PromotionCustomerGroup },
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

    return {
      promotion,
      hasSelectedGroups: computed(() => (promotion.value.customer_group || []).length > 0)
    }
  }
})
</script>
