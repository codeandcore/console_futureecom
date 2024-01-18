<template>
  <v-combobox
    v-model="ignoreRequirementsFor"
    :items="countries || []"
    item-text="name"
    item-value="code"
    multiple
    outlined
    :label="$t('Ignore Requirement For')"
    :return-object="false"
    hide-details="auto"
  >
    <template #selection="{ item, selected }">
      <v-slide-y-reverse-transition mode="out-in">
        <v-chip
          v-if="countries"
          :value="selected"
          label
          close
          @click:close="ignoreRequirementsFor = ignoreRequirementsFor.filter((code) => code !== item)"
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
  name: 'SettingsLocalisationRegionsIgnoreRequirements',

  props: {
    value: {
      type: Object as PropType<LocalisationSettings['regions']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { countries, findCountryByCode } = useCountries()

    const ignoreRequirementsFor = computed({
      get: () => props.value.ignore_requirement_for,
      set: (ignoreRequirementsFor) =>
        emit('input', {
          ...props.value,
          ignore_requirement_for: (ignoreRequirementsFor || []).length ? ignoreRequirementsFor : null
        })
    })

    const getCountryName = (code: string): string => {
      const country = findCountryByCode(code)
      return country ? country.name : code
    }

    return {
      getCountryName,
      countries,
      ignoreRequirementsFor
    }
  }
})
</script>
