<template>
  <v-combobox
    v-bind="$attrs"
    v-model="country"
    :search-input.sync="searchCountry"
    :label="$t('Country')"
    :items="countries"
    :disabled="!(countries || []).length"
    outlined
    hide-details="auto"
    @change="setCountry"
  >
    <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import { useSettings } from '@/composable/repositories/useSettings'
import type { Country } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CountryField',

  props: {
    value: {
      type: Object as PropType<Country | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<Country[]>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { getStoreSetting } = useSettings()
    const { countries: countryList } = useCountries()

    const countries = computed(() => {
      if (props.items) {
        return props.items
      }

      const allowedCountries = getStoreSetting('localisation.countries.allowed_list')

      if (!allowedCountries) {
        return countryList.value
      }

      return countryList.value.filter((address) => allowedCountries.includes(address.code))
    })

    const country = computed({
      get: () => props.value,
      set: (val: Country | undefined) => {
        emit('input', val)
        if (val) {
          emit('onSelected', val)
        }
      }
    })

    const searchCountry = ref(country.value?.name || '')

    const setCountry = (val: Country | string | undefined) => {
      if (!val) {
        searchCountry.value = ''
        country.value = undefined
        return
      }

      if (typeof val === 'string') {
        country.value = countries.value.find((c) => c.name.toLowerCase().startsWith(val.toLowerCase()))
      }

      searchCountry.value = country.value?.name || ''
    }

    return {
      country,
      countries,
      searchCountry,
      setCountry
    }
  }
})
</script>
