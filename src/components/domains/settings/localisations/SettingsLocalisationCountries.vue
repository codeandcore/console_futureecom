<template>
  <div>
    <h2>{{ $t('Countries') }}</h2>

    <div class="d-flex flex-column flex-gap-8 mt-4">
      <settings-localisation-countries-allowed-list v-model="countries" />

      <span>
        {{ $t(' List of countries that should be allowed for selection in various store places.') }}
      </span>
    </div>

    <div class="d-flex flex-column flex-gap-8 mt-4">
      <settings-localisation-countries-allowed-telephone-list v-model="countries" />

      <span>
        {{ $t('List of telephones prefixes that should be allowed for selection for phone numbers.') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SettingsLocalisationCountriesAllowedList from '@/components/domains/settings/localisations/countries/SettingsLocalisationCountriesAllowedList.vue'
import SettingsLocalisationCountriesAllowedTelephoneList from '@/components/domains/settings/localisations/countries/SettingsLocalisationCountriesAllowedTelephoneList.vue'
import type { LocalisationSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsLocalisationCountries',
  components: {
    SettingsLocalisationCountriesAllowedTelephoneList,
    SettingsLocalisationCountriesAllowedList
  },

  props: {
    value: {
      type: Object as PropType<LocalisationSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const countries = computed({
      get: () => props.value.countries,
      set: (countries) => emit('input', { ...props.value, countries })
    })

    return {
      countries
    }
  }
})
</script>
