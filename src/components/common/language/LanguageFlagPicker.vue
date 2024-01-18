<template>
  <div>
    <v-combobox
      v-bind="$attrs"
      v-model="selectedCountry"
      outlined
      :label="$t('Flag')"
      :items="items"
      item-text="name"
      item-value="emoji"
      return-object
      :loading="loading"
      hide-details="auto"
      :menu-props="{
        closeOnContentClick: true,
        disableKeys: true,
        maxHeight: 304
      }"
      :search-input.sync="searchCountry"
      @input="onLanguageSelect"
    >
      <template v-if="!searchCountry && !selectedCountry" #prepend-item>
        <div class="d-flex align-center mx-4">
          <span class="text-caption">{{ $t('Suggested') }}</span>
          <v-divider class="mx-4" />
        </div>
        <div
          v-for="(suggested, index) in suggestedCountries"
          :key="`dropdown-${index}`"
          role="option"
          type="button"
          :class="suggestedListItemClasses"
          @click="onLanguageSelect(suggested)"
        >
          <span>{{ suggested.emoji }} {{ suggested.name }}</span>
        </div>
        <div class="d-flex align-center mx-4">
          <span class="text-caption">{{ $t('Alphabetically') }}</span>
          <v-divider class="mx-4" />
        </div>
      </template>
      <template #item="{ item }">
        <span>{{ item.emoji }} {{ item.name }}</span>
      </template>
      <template #selection="{ item }">
        <span>{{ item.emoji }} {{ item.name }}</span>
      </template>
    </v-combobox>
    <div class="d-flex align-center flex-gap-8">
      <v-chip-group class="flex-gap-8">
        <v-chip
          v-for="(suggested, index) in suggestedCountries"
          :key="`chip-${index}`"
          @click="onLanguageSelect(suggested)"
        >
          {{ suggested.emoji }}
          {{ suggested.name }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCountries } from '@/composable/repositories/useCountries'
import { useVuetify } from '@/composable/useVuetify'
import type { Country, Language } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'LanguageFlagPicker',
  props: {
    value: {
      type: Object as () => Language,
      required: true
    }
  },

  setup(props, { emit }) {
    const { countries, loading, findCountryByFlag, findCountryByCode } = useCountries()

    const selectedCountry = ref<Country | undefined>(findCountryByFlag(props.value.flag))
    const searchCountry = ref('')

    const vuetify = useVuetify()

    const flag = computed({
      get: () => props.value.flag,
      set: (flag) => emit('input', { ...props.value, flag })
    })

    const suggestedCountries = computed(() => ['US', 'CA', 'GB'].map((code) => findCountryByCode(code)).filter(Boolean))

    const items = computed((): Country[] => {
      const countriesWithFlag = (countries.value || []).filter((country: Country) => !!country.emoji)

      if (!searchCountry.value) {
        const suggestedWithFlags = suggestedCountries.value.map((item) => item?.emoji).filter(Boolean)
        return countriesWithFlag.filter((item) => !suggestedWithFlags.includes(item.emoji))
      }

      return countriesWithFlag
        .filter((item) => {
          const searchCountryName = searchCountry.value.toLowerCase()
          const countryName = item.name.toLowerCase()
          return countryName.startsWith(searchCountryName)
        })
        .slice(0, 5)
    })

    const suggestedListItemClasses = computed(() => [
      'v-list-item',
      'v-list-item--link',
      vuetify?.theme.dark ? 'theme--dark' : 'theme--light'
    ])

    const onLanguageSelect = (country: Country) => {
      selectedCountry.value = country
      searchCountry.value = country?.name || ''
      flag.value = country?.emoji || ''
    }

    return {
      items,
      suggestedCountries,
      selectedCountry,
      searchCountry,
      onLanguageSelect,
      loading,
      suggestedListItemClasses
    }
  }
})
</script>
