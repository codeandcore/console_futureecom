<template>
  <country-field
    v-bind="$attrs"
    v-model="country"
    :items="countries"
    hide-details="auto"
    item-text="name"
    @input="setCountryCode"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import CountryField from '@/components/common/CountryField.vue'
import type { Country } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressCountry',
  components: { CountryField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { findCountryByCode, countries } = useCountries()
    const country = ref<Country | undefined>(findCountryByCode(props.value?.country_code || ''))

    const countryCode = computed({
      get: () => props.value?.country_code,
      set: (country_code) => emit('input', { ...props.value, country_code, region: '' })
    })

    const setCountryCode = () => (countryCode.value = country.value?.code || '')

    return {
      countries,
      country,
      setCountryCode
    }
  }
})
</script>
