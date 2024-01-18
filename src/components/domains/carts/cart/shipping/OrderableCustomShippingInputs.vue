<template>
  <div class="d-flex flex-column flex-gap-16">
    <custom-shipping-name v-model="customShipping" :error-messages="customErrors['name']" />
    <custom-shipping-type v-model="customShipping" :error-messages="customErrors['type']" />
    <orderable-custom-vat
      v-if="canReadTaxes && customShipping"
      v-model="vat"
      :price="customShipping.price"
      :gross-price="customShipping.gross_price"
      @update:prices="onVatChange"
    />
    <div class="d-flex flex-gap-16">
      <custom-shipping-price
        :key="`price-${vat ? vat.value : ''}`"
        v-model="customShipping"
        :vat="vat"
        :error-messages="customErrors['price']"
      />
      <custom-shipping-gross-price
        :key="`gross-price-${vat ? vat.value : ''}`"
        v-model="customShipping"
        :vat="vat"
        :error-messages="customErrors['gross_price']"
      />
    </div>
    <custom-shipping-price-type v-model="customShipping" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { mapErrors } from '@/composable/validator/useValidator'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import CustomShippingGrossPrice from '@/components/foundation/PriceGrossInput.vue'
import CustomShippingName from '@/components/foundation/NameInput.vue'
import CustomShippingPrice from '@/components/foundation/PriceInput.vue'
import CustomShippingPriceType from '@/components/common/selectables/SelectShippingPriceType.vue'
import CustomShippingType from '@/components/common/selectables/SelectShippingType.vue'
import OrderableCustomVat from '@/components/foundation/ApplicableVat.vue'
import useApi from '@/composable/useApi'
import type { Money } from '@futureecom/futureecom-js'
import type { OrderableShippingData } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'
import type { VatRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'OrderableCustomShippingInputs',

  components: {
    OrderableCustomVat,
    CustomShippingName,
    CustomShippingGrossPrice,
    CustomShippingPriceType,
    CustomShippingType,
    CustomShippingPrice
  },

  props: {
    value: {
      type: Object as PropType<OrderableShippingData>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  emit: {
    input: (_: OrderableShippingData) => true
  },

  setup(props, { emit }) {
    const customShipping = computed({
      get: () => props.value.custom,
      set: (custom: OrderableShippingData['custom']) => {
        return emit('input', { ...props.value, custom: removeEmptyFields(custom || {}, { emptyString: true }) })
      }
    })

    const onVatChange = (val: Record<'price' | 'gross_price', Money | null>) => {
      const vatId = vat.value?.id

      customShipping.value = {
        ...customShipping.value,
        price: val.price,
        gross_price: val.gross_price,
        vat: vatId ? { id: vatId } : null
      }
    }

    const { canRead: canReadTaxes } = useCrudChecker('taxes\\vat')

    const vat = ref<VatRate>()

    if (canReadTaxes.value && props.value.custom?.vat?.id) {
      useApi()
        .taxes.getVatRate(props.value.custom.vat.id)
        .then((value) => (vat.value = value))
    }

    const customErrors = computed(() => mapErrors('custom.', '', props.errors))

    return {
      customErrors,
      vat,
      customShipping,
      canReadTaxes,
      onVatChange
    }
  }
})
</script>
