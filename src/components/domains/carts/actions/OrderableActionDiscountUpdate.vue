<template>
  <switch-field
    :label="$t('Disable discounts')"
    :value="value.discounts_disabled"
    :disabled="isLoading || disabled"
    @input="updateDiscountsStatus"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import SwitchField from '@/components/common/SwitchField.vue'
import useApi from '@/composable/useApi'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableActionDiscountUpdate',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const api = useApi()
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const isLoading = ref(false)

    const updateDiscountsStatus = (disableDiscounts: boolean) => {
      isLoading.value = true

      api.carts
        .updateDiscountInOrderable(props.value, {
          disable_discounts: disableDiscounts
        })
        .then((item) => {
          emit('input', item)
          addSuccessToast(t(item.discounts_disabled ? 'Discounts were disabled' : 'Discounts were enabled'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to update discounts'))
        .finally(() => {
          isLoading.value = false
        })
    }

    return {
      isLoading,
      updateDiscountsStatus
    }
  }
})
</script>
