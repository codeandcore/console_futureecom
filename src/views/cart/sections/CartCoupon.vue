<template>
  <div class="d-flex flex-column flex-gap-8">
    <cart-coupon-select v-model="cart" />

    <switch-field v-model="showCustomCoupon" :label="$t('Set custom coupon')" />
    <v-slide-y-reverse-transition mode="out-in">
      <cart-add-custom-coupon v-show="showCustomCoupon" v-model="cart" />
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import CartAddCustomCoupon from '@/components/domains/carts/actions/CartAddCustomCoupon.vue'
import CartCouponSelect from '@/components/domains/carts/coupon/CartCouponSelect.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCoupon',
  components: {
    SwitchField,
    CartAddCustomCoupon,
    CartCouponSelect
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const showCustomCoupon = ref(false)

    const cart = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      cart,
      showCustomCoupon
    }
  }
})
</script>
