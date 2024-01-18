<template>
  <div class="d-flex flex-column">
    <translation-tabs :translatable-values="['name']" :errors="errors">
      <template #default.name>
        <sale-tax-name v-model="saleTax" :error-messages="errors['name']" />
      </template>
      <template #name="{ code }">
        <sale-tax-name v-model="saleTax" :translation-code="code" />
      </template>
    </translation-tabs>

    <sale-tax-rate v-model="saleTax" :error-messages="errors['rate']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import SaleTaxRate from '@/components/domains/taxes/sale/SaleTaxRate.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxRate } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SaleTaxInputs',

  components: { SaleTaxRate, SaleTaxName: NameInput, TranslationTabs },

  props: {
    value: {
      type: Object as PropType<TaxRate>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const saleTax = computed({
      get: () => props.value,
      set: (saleTax) => emit('input', saleTax)
    })

    return {
      saleTax
    }
  }
})
</script>
