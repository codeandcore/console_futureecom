<template>
  <switch-field
    :label="$t('Disable taxes')"
    class="mt-0"
    :value="value.taxes_disabled"
    :disabled="loading || readonly"
    @input="updateCartTaxes"
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
  name: 'OrderableActionDisableTaxes',

  components: {
    SwitchField
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const api = useApi()
    const { addSuccessToast } = useToasts()
    const loading = ref(false)
    const updateCartTaxes = () => {
      loading.value = true
      api.carts
        .disableTaxesOrderable(props.value, !props.value.taxes_disabled)
        .then((val) => {
          emit('input', val)
          addSuccessToast(t(val.taxes_disabled ? 'Taxes were disabled' : 'Taxes were enabled'))
        })
        .catch((err) => emitOrderableError(err, t('Unable to update taxes')))
        .finally(() => (loading.value = false))
    }
    return {
      loading,
      updateCartTaxes
    }
  }
})
</script>
