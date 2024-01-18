<template>
  <div class="d-flex flex-column flex-gap-16">
    <cart-custom-coupon-name v-model="customCoupon" :loading="loading" :error-messages="errors['name']" />
    <cart-custom-coupon-value v-model.number="customCoupon" :loading="loading" :error-messages="errors['value']" />
    <cart-custom-coupon-rate-type v-model="customCoupon" :loading="loading" :error-messages="errors['rate_type']" />
    <cart-custom-coupon-target v-model="customCoupon" :loading="loading" :error-messages="errors['target']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CartCustomCouponName from '@/components/foundation/NameInput.vue'
import CartCustomCouponRateType from '@/components/domains/carts/coupon/CartCustomCouponRateType.vue'
import CartCustomCouponTarget from '@/components/domains/carts/coupon/CartCustomCouponTarget.vue'
import CartCustomCouponValue from '@/components/domains/carts/coupon/CartCustomCouponValue.vue'
import type { OrderableCustomDiscount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'CartCustomCouponInputs',

  components: {
    CartCustomCouponRateType,
    CartCustomCouponName,
    CartCustomCouponValue,
    CartCustomCouponTarget
  },

  props: {
    value: {
      type: Object as PropType<OrderableCustomDiscount>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const customCoupon = computed({
      get: () => props.value,
      set: (val: OrderableCustomDiscount) => emit('input', val)
    })

    return {
      customCoupon
    }
  }
})
</script>
