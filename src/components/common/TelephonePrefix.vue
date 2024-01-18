<template>
  <v-menu v-model="showPrefixes" offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn text color="primary" dark v-bind="attrs" small class="d-flex align-center" v-on="on">
        <span v-if="country" class="d-flex align-center flex-gap-8">
          <span class="text-h6">{{ country.emoji }}</span>
          <span class="">{{ country.name }}</span>
        </span>
        <v-icon v-else>flag</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <country-field
          v-model="country"
          class="ma-4"
          :items="allowedCountries"
          item-text="text"
          @onSelected="closeMenu"
        >
          <template #selection="{ item }">
            <div v-if="typeof item !== 'string'" class="d-flex flex-gap-8">
              <span>{{ item.emoji }}</span>
              <span>{{ item.name }}</span>
              <span>(+{{ item.dialling.prefix }})</span>
            </div>
            <span v-else>{{ item }}</span>
          </template>
          <template #item="{ item }">
            <div class="d-flex flex-gap-8">
              <span>{{ item.emoji }}</span>
              <span>{{ item.name }}</span>
              <span>(+{{ item.dialling.prefix }})</span>
            </div>
          </template>
        </country-field>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { useAllowedCountriesWithPrefix } from '@/composable/useAllowedCountriesWithPrefix'
import CountryField from '@/components/common/CountryField.vue'
import type { Country } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { Telephone } from '@futureecom/futureecom-js/dist/futureecom'

export default defineComponent({
  name: 'TelephonePrefix',
  components: { CountryField },
  props: {
    value: {
      type: Object as PropType<Telephone>,
      default: null
    }
  },

  setup(props, { emit }) {
    const showPrefixes = ref(false)

    const { findCountryWithPrefix, allowedCountries } = useAllowedCountriesWithPrefix()

    const country = computed({
      get: (): Country | undefined => {
        const phoneNumber = `+${props.value?.prefix || ''}${props.value?.number || ''}`
        const countryCode = parsePhoneNumberFromString(phoneNumber)?.country
        return findCountryWithPrefix(`${countryCode}`)
      },
      set: (val: Country | undefined) => emit('input', { ...props.value, prefix: val?.dialling.prefix || '' })
    })

    const closeMenu = () => (showPrefixes.value = false)

    return {
      allowedCountries,
      showPrefixes,
      country,
      closeMenu
    }
  }
})
</script>
