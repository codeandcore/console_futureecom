<template>
  <v-combobox
    v-model="allowedTelephoneList"
    :items="countries || []"
    hide-details="auto"
    multiple
    outlined
    :label="$t('Allowed Telephones List')"
    item-value="code"
    :item-text="(item) => getCountryWithPhone(item.code)"
    :return-object="false"
  >
    <template #selection="{ selected, item }">
      <v-slide-y-reverse-transition>
        <v-chip
          v-if="countries"
          :value="selected"
          label
          close
          @click:close="allowedTelephoneList = allowedTelephoneList.filter((code) => code !== item)"
        >
          {{ getCountryWithPhone(item) }}
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
  name: 'SettingsLocalisationCountriesAllowedTelephoneList',

  props: {
    value: {
      type: Object as PropType<LocalisationSettings['countries']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { countries, findCountryByCode } = useCountries()

    const allowedTelephoneList = computed({
      get: () => props.value.allowed_telephones_list,
      set: (allowedTelephoneList) => {
        emit('input', {
          ...props.value,
          allowed_telephones_list: (allowedTelephoneList || []).length ? allowedTelephoneList : null
        })
      }
    })

    const getCountryWithPhone = (code: string): string => {
      const country = findCountryByCode(code) || { name: 'code', dialling: { prefix: '' } }
      return `${country.name} (+${country.dialling.prefix})`
    }

    return {
      getCountryWithPhone,
      countries,
      allowedTelephoneList
    }
  }
})
</script>
