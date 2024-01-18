<template>
  <v-combobox
    v-model="allowedList"
    outlined
    :label="$t('Allowed List')"
    :items="countries"
    item-value="code"
    item-text="name"
    :return-object="false"
    multiple
    hide-details="auto"
  >
    <template #selection="{ item, selected }">
      <v-slide-y-reverse-transition>
        <v-chip
          v-if="countries"
          :value="selected"
          label
          close
          @click:close="allowedList = allowedList.filter((code) => code !== item)"
        >
          {{ getCountryName(item) }}
        </v-chip>
      </v-slide-y-reverse-transition>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import type { LocalisationSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsLocalisationCountriesAllowedList',

  props: {
    value: {
      type: Object as PropType<LocalisationSettings['countries']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { countries, findCountryByCode } = useCountries()

    const allowedList = computed({
      get: () => props.value.allowed_list,
      set: (allowedList) => {
        emit('input', { ...props.value, allowed_list: (allowedList || []).length ? allowedList : null })
      }
    })

    const getCountryName = (code: string): string => {
      const country = findCountryByCode(code)
      return country ? country.name : code
    }

    return {
      getCountryName,
      countries,
      allowedList
    }
  }
})
</script>
