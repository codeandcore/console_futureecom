<template>
  <switch-field v-model="shipping_taxable" :label="$t('Shipping is taxable')" v-bind="$attrs" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'SaleTaxGroupShippingTaxable',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
      required: true
    }
  },
  setup(props, { emit }) {
    const shipping_taxable = computed({
      get: () => props.value.shipping_taxable,
      set: (shipping_taxable) => emit('input', { ...props.value, shipping_taxable })
    })

    return {
      shipping_taxable
    }
  }
})
</script>
