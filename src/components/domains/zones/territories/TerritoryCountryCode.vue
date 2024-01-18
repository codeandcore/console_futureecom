<template>
  <country-field v-bind="$attrs" v-model="country" hide-details="auto" item-text="name" @input="setCountryCode" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import CountryField from '@/components/common/CountryField.vue'
import type { Country } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryCountryCode',
  components: { CountryField },
  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const { findCountryByCode } = useCountries()
    const country = ref<Country | undefined>(findCountryByCode(props.value.country_code || ''))

    const countryCode = computed({
      get: () => props.value.country_code,
      set: (country_code) => emit('input', { ...props.value, country_code, administrative_area: '' })
    })

    const setCountryCode = () => (countryCode.value = country.value?.code || '')

    return {
      country,
      setCountryCode
    }
  }
})
</script>
