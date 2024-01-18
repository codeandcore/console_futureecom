<template>
  <v-autocomplete
    v-model="selected"
    :items="data"
    :loading="loading || loadingCouponUpdate"
    outlined
    item-text="name"
    item-value="code"
    return-object
    hide-details
    clearable
    :label="$t('Coupon')"
    @input="selectCoupon"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PromotionCoupon } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCouponSelect',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()
    const selected = ref(props.value.coupon || '')
    const loadingCouponUpdate = ref(false)

    const couponsLoader = collectionLoader()
    couponsLoader.loadCollection(() => api.promotions.promotions({ perPage: -1, filter: { type: { eq: 'coupon' } } }))

    const selectCoupon = (val: PromotionCoupon): void => {
      const fn = val
        ? (): Promise<Orderable> => api.carts.updateDiscountInOrderable(props.value, { coupon: val.code })
        : (): Promise<Orderable> => api.carts.updateDiscountInOrderable(props.value, { coupon: null })

      fn()
        .then((val) => {
          emit('input', val)
          addSuccessToast(t(selected.value ? 'Coupon applied' : 'Coupon deleted'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to add coupon'))
        .finally(() => (loadingCouponUpdate.value = false))
    }

    return {
      selected,
      selectCoupon,
      loadingCouponUpdate,
      ...couponsLoader
    }
  }
})
</script>
