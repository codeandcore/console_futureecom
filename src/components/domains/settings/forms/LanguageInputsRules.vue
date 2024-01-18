<template>
  <div class="d-flex flex-column flex-gap-16">
    <language-flag-picker v-model="language" :rules="rules.required" class="mb-4" />
    <language-name v-model="language" :rules="rules.required" :label="$t('Language name')" />
    <language-code v-model="language" :disabled="disabledCode" :rules="rules.code" :label="$t('Language code')" />
    <language-iso
      v-model="language"
      class="d-flex flex-column flex-grow-1"
      :rules="rules.iso"
      suggest-locales
      @input="detectDirection"
    />
    <language-direction-field v-model="language" class="my-4 align-center" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import {
  useLocaleValidationRule,
  useNotEmptyValidationRule,
  useUniqueAttributeValidationRule
} from '@/composable/validationRules'
import { useLocales } from '@/composable/repositories/useLocales'
import LanguageCode from '@/components/foundation/CodeInput.vue'
import LanguageDirectionField from '@/components/common/language/LanguageDirectionField.vue'
import LanguageFlagPicker from '@/components/common/language/LanguageFlagPicker.vue'
import LanguageIso from '@/components/common/language/LanguageIso.vue'
import LanguageName from '@/components/foundation/NameInput.vue'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

/** @deprecated To be removed after mapping Translation Language forms to laravel-kind validator **/
export default defineComponent({
  name: 'LanguageInputsRules',
  components: { LanguageDirectionField, LanguageIso, LanguageCode, LanguageName, LanguageFlagPicker },
  props: {
    value: {
      type: Object as PropType<Language>,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    },
    languages: {
      type: Array as PropType<Language[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { isRTL } = useLocales()

    const disabledCode = computed(() => props.editMode && !!props.value.code)
    const languageCodes = computed(() => props.languages.map((item) => item.code))

    const language = computed({
      get: () => props.value,
      set: (val: Language) => emit('input', val)
    })

    const detectDirection = (val: Language) => {
      language.value = { ...val, dir: isRTL(val?.iso || '') ? 'rtl' : 'ltr' }
    }

    const rules = {
      required: [(value: string): ValidationRule => useNotEmptyValidationRule(value)],
      code: !disabledCode.value
        ? [
            (code: string): ValidationRule => useNotEmptyValidationRule(code),
            (code: string): ValidationRule => useUniqueAttributeValidationRule(code, languageCodes.value, 'code')
          ]
        : [],
      iso: [
        (iso: string): ValidationRule => useNotEmptyValidationRule(iso),
        (iso: string): ValidationRule => useLocaleValidationRule(iso)
      ]
    }

    return {
      disabledCode,
      language,
      rules,
      detectDirection
    }
  }
})
</script>
