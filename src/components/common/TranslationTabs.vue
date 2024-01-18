<template>
  <v-card flat outlined data-cy="translation-tabs">
    <v-tabs v-model="tab" background-color="primary" dark center-active show-arrows>
      <v-tab v-for="language in languageTabs" :key="language.code" @click="$emit('click', language.code)">
        <div class="d-flex flex-gap-16 align-center">
          <span :data-cy="`translation-tabs-language-${language.code.toLowerCase()}`">
            {{ language.flag }} {{ language.name }}
          </span>
          <div
            v-if="tabErrors[`${language.code.toLowerCase()}`]"
            :data-cy="`translation-tabs-error-${language.code.toLowerCase()}`"
          >
            <slot name="error-icon" :code="language.code">
              <v-icon color="red">error</v-icon>
            </slot>
          </div>
        </div>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" data-cy="translation-tab-content">
      <v-tab-item v-for="language in languageTabs" :key="language.code" eager>
        <v-card
          class="ma-4 d-flex flex-column flex-gap-16"
          flat
          :data-cy="`translation-tabs-content-${language.code.toLowerCase()}`"
        >
          <slot
            v-for="translatableValue in translatableValues"
            :current-tab="tab"
            :name="getSlotName(language.code, translatableValue)"
            :code="language.code.toLowerCase()"
          />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getSectionErrors } from '@/composable/validator/useValidator'
import { useSettings } from '@/composable/repositories/useSettings'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import type { GeneralSettingsLocale } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'TranslationTabs',

  props: {
    translatableValues: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      default: () => ({})
    }
  },

  setup(props) {
    const tab = ref(0)

    const { translationLanguages } = useTranslationLanguages()
    const { getSettings } = useSettings()
    const defaultLanguage = getSettings<GeneralSettingsLocale['language']>('general.locale.language').value || ''

    const getSlotName = (code: string, translatableValue: string): string => {
      return code === defaultLanguage ? `default.${translatableValue}` : translatableValue
    }

    const languageTabs = computed(() => [
      { code: defaultLanguage, flag: '', name: 'Default' },
      ...translationLanguages.value.filter((item) => item.code !== defaultLanguage)
    ])

    const tabErrors = computed(() => {
      const tabs = translationLanguages.value.reduce((prev, current) => {
        const code = current.code.toLowerCase()
        const translationFields = props.translatableValues.map((val) => {
          return code === defaultLanguage ? val : `translations.${code}.${val}`
        })

        return { ...prev, [current.code.toLowerCase()]: translationFields }
      }, {})

      return getSectionErrors(tabs, props.errors)
    })

    return {
      languageTabs,
      tab,
      tabErrors,
      getSlotName
    }
  }
})
</script>
