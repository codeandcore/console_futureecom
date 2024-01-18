<template>
  <div>
    <translation-tabs :translatable-values="['name']" :errors="errors">
      <template #default.name>
        <vat-rate-name v-model="vat" :error-messages="errors['name']" />
      </template>
      <template #name="{ code }">
        <vat-rate-name v-model="vat" :translation-code="code" />
      </template>
    </translation-tabs>

    <vat-rate-value v-model="vat" :error-messages="errors['value']" />

    <vat-rate-products v-model="vat" :errors="errors" />
    <vat-rate-shipping-methods v-model="vat" :errors="errors" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import VatRateProducts from '@/components/domains/taxes/vat/VatRateProducts.vue'
import VatRateShippingMethods from '@/components/domains/taxes/vat/VatRateShippingMethods.vue'
import VatRateValue from '@/components/domains/taxes/vat/VatRateValue.vue'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateInputs',

  components: {
    VatRateValue,
    VatRateProducts,
    VatRateShippingMethods,
    VatRateName: NameInput,
    TranslationTabs
  },

  props: {
    value: {
      type: Object as PropType<Vat>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const vat = computed({
      get: () => props.value,
      set: (vat) => emit('input', vat)
    })

    return {
      vat
    }
  }
})
</script>
