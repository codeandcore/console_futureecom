<template>
  <v-form @submit.prevent="applyCustomCoupon">
    <cart-custom-coupon-inputs v-model="customCoupon" :errors="errors" @input="onChange" />

    <div class="d-flex justify-space-between mt-4">
      <v-btn depressed color="primary" :loading="loading.delete" :disabled="loading.update" @click="removeCustomCoupon">
        {{ $t('Remove custom coupon') }}
      </v-btn>
      <v-btn depressed color="primary" type="submit" :loading="loading.update" :disabled="!isValid || loading.delete">
        {{ $t('Apply') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import CartCustomCouponInputs from '@/components/domains/carts/coupon/CartCustomCouponInputs.vue'
import useApi from '@/composable/useApi'
import type { Orderable, OrderableCustomDiscount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'CartAddCustomCoupon',

  components: {
    CartCustomCouponInputs
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()
    const { errors, validate, isValid, setErrorsFromAPI } = useValidator()

    const defaultCouponData: OrderableCustomDiscount = {
      rate_type: 'distributed',
      value: 0,
      target: 'items',
      name: 'Custom Discount'
    }

    const customCoupon = ref({ ...defaultCouponData })
    const loading = reactive({
      update: false,
      delete: false
    })

    const rules = computed(() => {
      const defaultRules: RuleDefinitions = {
        rate_type: ['required', 'string'],
        value: ['required', 'numeric', 'gt:0'],
        target: ['required', 'string'],
        name: ['required', 'string']
      }

      if (customCoupon.value.rate_type === 'percentage') {
        defaultRules['value'].push('max:100')
      }

      return defaultRules
    })

    const onChange = () => validate(customCoupon.value, rules.value)

    const saveCouponData = (couponData: OrderableCustomDiscount | null) => {
      api.carts
        .updateDiscountInOrderable(props.value, { custom: couponData })
        .then((val) => {
          emit('input', val)
          addSuccessToast('Custom coupon was updated.')
        })
        .catch((err) => {
          emitOrderableError(err, t('Unable to update custom coupon.'))
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => {
          loading.update = false
          loading.delete = false
        })
    }

    const applyCustomCoupon = () => {
      validate(customCoupon.value, rules.value, true)

      if (!isValid.value) {
        return
      }

      loading.update = true
      saveCouponData(customCoupon.value)
    }

    const removeCustomCoupon = () => {
      customCoupon.value = { ...defaultCouponData }
      loading.delete = true

      saveCouponData(null)
    }

    return {
      errors,
      loading,
      isValid,
      customCoupon,
      applyCustomCoupon,
      removeCustomCoupon,
      onChange
    }
  }
})
</script>
