<template>
  <v-dialog v-model="isOpen" max-width="600" scrollable>
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ attrs, on }" />
    </template>

    <v-form @submit.prevent="onApply">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span v-if="!shipping">{{ $t('Set custom shipping') }}</span>
          <div v-else class="d-flex flex-column">
            <span>
              {{ `${$t('Set custom shipping price')}` }}
            </span>
            <span class="grey--text text-caption">
              {{ `${shipping.name}` }}
            </span>
          </div>
          <v-btn icon @click="isOpen = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <orderable-custom-shipping-inputs v-model="item" :errors="errors" @input="onItemChange" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex justify-end">
          <v-btn class="ma-2" depressed color="primary" type="submit" :disabled="!isValid" :loading="loading">
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { ShippingPriceType, ShippingType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { isObject } from '@/libs/objects'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import OrderableCustomShippingInputs from './OrderableCustomShippingInputs.vue'
import useApi from '@/composable/useApi'
import type { Orderable, OrderableShippingData } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { OrderableShippingDetail, Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'OrderableCustomShippingDialog',

  components: {
    OrderableCustomShippingInputs
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },
    orderable: {
      type: Object as PropType<Orderable>,
      default: undefined
    },
    shipping: {
      type: Object as PropType<Shipping | OrderableShippingDetail>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()

    const isOpen = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const loading = ref(false)

    const isShipping = (val: unknown): val is Shipping => {
      return isObject(val) && !('is_custom' in val)
    }

    const setCustomValue = (): OrderableShippingData => {
      const custom = {
        name: props.shipping?.name,
        type: props.shipping?.type || ShippingType.DELIVERY,
        price_type: props.shipping?.price_type || ShippingPriceType.FIXED,
        vat: props.shipping?.vat?.id ? { id: props.shipping.vat.id } : undefined,
        price: props.shipping?.price || null,
        gross_price: props.shipping?.gross_price || null
      }

      return isShipping(props.shipping) ? { method: props.shipping.code, custom } : { custom }
    }

    const item = ref<OrderableShippingData>(setCustomValue())

    const { errors, validate, isValid } = useValidator<OrderableShippingData>(item.value)

    const rules = computed((): RuleDefinitions => {
      if (!isShipping(props.shipping)) {
        return {
          'custom.name': ['required', 'string'],
          'custom.type': ['required', 'string'],
          'custom.price': ['required'],
          'custom.gross_price': ['required']
        }
      }
      return {
        'custom.price': ['required'],
        'custom.gross_price': ['required']
      }
    })

    const onItemChange = () => validate(item.value, rules.value)

    const onApply = (): void => {
      validate(item.value, rules.value, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      api.carts
        .updateShippingInOrderable(props.orderable, item.value)
        .then((val) => {
          addSuccessToast(t('Shipping method has been applied'))
          isOpen.value = false
          emit('update:orderable', val)
        })
        .catch((err) => emitOrderableError(err, 'Unable to get shipping method'))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      isOpen,
      isValid,
      errors,
      loading,
      onItemChange,
      onApply
    }
  }
})
</script>
