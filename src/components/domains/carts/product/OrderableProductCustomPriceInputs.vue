<template>
  <div class="d-flex flex-column flex-gap-16">
    <applicable-vat
      v-if="canReadTaxes && custom"
      v-model="vat"
      :price="custom.price"
      :gross-price="custom.gross_price"
      clearable
      @update:prices="onVatChange"
    />
    <div class="d-flex flex-gap-16">
      <price-input
        :key="`price-${vat ? vat.value : ''}`"
        v-model="custom"
        :vat="vat"
        clearable
        :error-messages="customErrors['price']"
      />
      <price-gross-input
        :key="`gross-price-${vat ? vat.value : ''}`"
        v-model="custom"
        :vat="vat"
        clearable
        :error-messages="customErrors['gross_price']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { mapErrors } from '@/composable/validator/useValidator'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import ApplicableVat from '@/components/foundation/ApplicableVat.vue'
import PriceGrossInput from '@/components/foundation/PriceGrossInput.vue'
import PriceInput from '@/components/foundation/PriceInput.vue'
import useApi from '@/composable/useApi'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'
import type { UpdateOrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { ValidationErrors } from '@/types/validator'
import type { VatRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'OrderableProductCustomPriceInputs',

  components: { ApplicableVat, PriceGrossInput, PriceInput },

  props: {
    value: {
      type: Object as PropType<Pick<UpdateOrderableItem, 'custom'>>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const custom = computed({
      get: (): UpdateOrderableItem['custom'] => ({ price: null, gross_price: null, vat: null, ...props.value.custom }),
      set: (custom) => {
        const isEmpty = !removeEmptyFields(custom || {}, { nullValue: true })
        emit('input', { ...props.value, custom: isEmpty ? undefined : custom })
      }
    })

    const vat = ref<VatRate>()

    const { canRead: canReadTaxes } = useCrudChecker('taxes\\vat')

    if (canReadTaxes.value && props.value.custom?.vat?.id) {
      useApi()
        .taxes.getVatRate(props.value.custom.vat.id)
        .then((value) => (vat.value = value))
    }

    const onVatChange = (val: Record<'price' | 'gross_price', Money | null>) => {
      const vatId = vat.value?.id

      custom.value = {
        ...custom.value,
        price: val.price,
        gross_price: val.gross_price,
        vat: vatId ? { id: vatId } : null
      }
    }

    const customErrors = computed(() => mapErrors('custom.', '', props.errors))

    return {
      custom,
      vat,
      canReadTaxes,
      customErrors,
      onVatChange
    }
  }
})
</script>
