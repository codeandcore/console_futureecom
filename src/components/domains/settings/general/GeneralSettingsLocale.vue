<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div v-if="form" class="d-flex flex-column ma-6 text-caption">
            <locale-field v-model="form.default" suggest-locales :rules="rules.locale" />
            <span class="mb-8">
              {{ $t('general.settings.locale') }}
            </span>

            <v-text-field v-model="form.language" outlined :label="`${$t('Language code')} `" :rules="rules.language" />
            <span class="mb-3">
              {{ $t('general.settings.language') }}
            </span>
            <span class="my-3">
              {{ $t('general.settings.language.change') }}
            </span>
            <span class="my-3">
              {{ $t('general.settings.language.change.example') }}
            </span>
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useLocaleValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import LocaleField from '@/components/common/LocaleField.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { LocaleSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsLocale',
  components: { Scrollable, FormValidatorWrapper, LocaleField },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<LocaleSettings>(props.value.locale)

    const rules = {
      locale: [
        (locale: string): ValidationRule => useNotEmptyValidationRule(locale),
        (locale: string): ValidationRule => useLocaleValidationRule(locale)
      ],
      language: [(language: string): ValidationRule => useNotEmptyValidationRule(language)]
    }

    const submit = (): void => emit('submit', { code: 'general.locale', payload: form.value })

    return {
      rules,
      submit,
      form
    }
  }
})
</script>
