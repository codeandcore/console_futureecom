<template>
  <div class="d-flex flex-column flex-gap-16">
    <address-first-name v-model="address" :rules="rules.given_name" />
    <address-last-name v-model="address" :rules="rules.family_name" />
    <address-street v-model="address" :rules="rules.address_line1" />
    <address-country v-model="address" :rules="rules.country_code" />
    <address-region
      v-model="address"
      :rules="rules.administrative_area"
      :hint="regionHint"
      :has-regions.sync="hasRegions"
    />
    <address-postcode v-model="address" :rules="rules.postal_code" />
    <address-city v-model="address" :rules="rules.locality" />
    <address-is-default v-if="!isGuest" v-model="address" :disabled="isDefault" />
    <address-telephone v-model="address" />
    <address-company v-model="address" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import AddressCity from '@/components/domains/customers/customer/addresses/AddressCity.vue'
import AddressCompany from '@/components/domains/customers/customer/addresses/AddressCompany.vue'
import AddressCountry from '@/components/domains/customers/customer/addresses/AddressCountry.vue'
import AddressFirstName from '@/components/domains/customers/customer/addresses/AddressFirstName.vue'
import AddressIsDefault from '@/components/domains/customers/customer/addresses/AddressIsDefault.vue'
import AddressLastName from '@/components/domains/customers/customer/addresses/AddressLastName.vue'
import AddressPostcode from '@/components/domains/customers/customer/addresses/AddressPostcode.vue'
import AddressRegion from '@/components/domains/customers/customer/addresses/AddressRegion.vue'
import AddressStreet from '@/components/domains/customers/customer/addresses/AddressStreet.vue'
import AddressTelephone from '@/components/domains/customers/customer/addresses/AddressTelephone.vue'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CustomerAddressInputs',
  components: {
    AddressTelephone,
    AddressPostcode,
    AddressCompany,
    AddressIsDefault,
    AddressCity,
    AddressRegion,
    AddressCountry,
    AddressStreet,
    AddressLastName,
    AddressFirstName
  },
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    },
    isGuest: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root, emit }) {
    const address = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const hasRegions = ref(false)
    const isDefault = ref(props.value.is_default)
    const regionHint = computed(() => (!address.value.country_code ? root.$t('Select country first') : ''))

    const rules = {
      given_name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      family_name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      country_code: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      postal_code: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      address_line1: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      administrative_area: [
        (val: string): ValidationRule => (hasRegions.value ? useNotEmptyValidationRule(val) : true)
      ],
      locality: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    return {
      address,
      isDefault,
      hasRegions,
      rules,
      regionHint
    }
  }
})
</script>
