<template>
  <country-field
    v-bind="$attrs"
    v-model="country"
    hide-details="auto"
    item-text="name"
    :items="countries"
    @input="setCountryCode"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import CountryField from '@/components/common/CountryField.vue'
import type { AddressContactSettings, Country } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressCountry',
  components: { CountryField },
  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { countries } = useCountries()
    const { findCountryByCode } = useCountries()
    const country = ref<Country | undefined>(findCountryByCode(props.value.country_code || ''))

    const countryCode = computed({
      get: () => props.value.country_code,
      set: (country_code) => emit('input', { ...props.value, country_code, region: null })
    })

    const setCountryCode = () => (countryCode.value = country.value?.code || '')

    return {
      country,
      setCountryCode,
      countries
    }
  }
})
</script>
