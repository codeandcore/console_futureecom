<template>
  <div class="d-flex flex-column flex-gap-16">
    <sale-tax-group-name v-model="saleTaxGroup" :error-messages="errors['name']" />
    <sale-tax-group-shipping-taxable v-model="saleTaxGroup" />
    <sale-tax-group-zone-codes v-model="saleTaxGroup" :error-messages="locationsError" />

    <sale-tax-group-tax-rate-ids v-model="saleTaxGroup" :items="saleTaxGroup.rates" :errors="errors" />
    <sale-tax-group-customer-group v-model="saleTaxGroup" :errors="errors" />

    <div>
      <sale-tax-group-taxonomy v-model="saleTaxGroup" hide-details="auto" />
      <span class="grey--text text-caption">
        {{ $t('Leaving taxonomy field empty will cause tax group to match all products.') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import SaleTaxGroupCustomerGroup from '@/components/domains/taxes/SaleTaxGroup/SaleTaxGroupCustomerGroup.vue'
import SaleTaxGroupShippingTaxable from '@/components/domains/taxes/SaleTaxGroup/SaleTaxGroupShippingTaxable.vue'
import SaleTaxGroupTaxRateIds from '@/components/domains/taxes/SaleTaxGroup/SaleTaxGroupSaleTaxIds.vue'
import SaleTaxGroupTaxonomy from '@/components/domains/taxes/SaleTaxGroup/SaleTaxGroupTaxonomy.vue'
import SaleTaxGroupZoneCodes from '@/components/domains/taxes/SaleTaxGroup/SaleTaxGroupZoneCodes.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'SaleTaxGroupInputs',
  components: {
    SaleTaxGroupName: NameInput,
    SaleTaxGroupCustomerGroup,
    SaleTaxGroupTaxonomy,
    SaleTaxGroupTaxRateIds,
    SaleTaxGroupZoneCodes,
    SaleTaxGroupShippingTaxable
  },

  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const saleTaxGroup = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const locationsError = computed(() => {
      const requestError = 'The value of zone code field must exists in Zones service.'
      const mappedError = 'Selected zone does not exist'
      return props.errors['zone_code'] === requestError ? mappedError : props.errors['zone_code']
    })

    return {
      saleTaxGroup,
      locationsError
    }
  }
})
</script>
