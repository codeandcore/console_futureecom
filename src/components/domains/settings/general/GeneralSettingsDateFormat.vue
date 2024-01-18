<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>

        <template #scrollable-content>
          <div v-if="form" class="d-flex flex-column ma-6">
            <span class="text-caption">
              {{ $t('general.settings.timezone') }}
            </span>
            <div class="d-flex flex-column flex-gap-32 mt-4">
              <general-settings-date-format-global v-model="form" class="d-flex flex-column flex-gap-16" />
              <general-settings-date-format-console
                v-model="form"
                :rules="rules"
                class="d-flex flex-column flex-gap-16"
              />
              <general-settings-date-format-pos v-model="form" :rules="rules" class="d-flex flex-column flex-gap-16" />
              <general-settings-date-format-backend
                v-model="form"
                :rules="rules"
                class="d-flex flex-column flex-gap-16"
              />
            </div>
            <span class="text-caption mt-4">
              {{ $t('Backend stands for documents and other Application related parts with dates.') }}
            </span>
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingsDateFormatBackend from '@/components/domains/settings/general/DateFormat/GeneralSettingsDateFormatBackend.vue'
import GeneralSettingsDateFormatConsole from '@/components/domains/settings/general/DateFormat/GeneralSettingsDateFormatConsole.vue'
import GeneralSettingsDateFormatGlobal from '@/components/domains/settings/general/DateFormat/GeneralSettingsDateFormatGlobal.vue'
import GeneralSettingsDateFormatPos from '@/components/domains/settings/general/DateFormat/GeneralSettingsDateFormatPos.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type {
  DateTimeFormat,
  GeneralSettingsDateFormatResponse,
  GeneralSettingsResponse
} from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsDateFormat',
  components: {
    FormValidatorWrapper,
    Scrollable,
    GeneralSettingsDateFormatBackend,
    GeneralSettingsDateFormatPos,
    GeneralSettingsDateFormatConsole,
    GeneralSettingsDateFormatGlobal
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const removeArrays = (payload: GeneralSettingsDateFormatResponse) => {
      const apps: (keyof GeneralSettingsDateFormatResponse)[] = ['console', 'backend', 'pos']
      const removed = apps.reduce((previous, current) => {
        return Array.isArray(payload[current]) ? { ...previous, [current]: null } : { ...previous }
      }, structuredClone(payload))

      return { ...payload, ...removed }
    }

    const form = ref<GeneralSettingsDateFormatResponse>(removeArrays(props.value.date_format))

    const fields: (keyof DateTimeFormat)[] = ['time', 'date', 'calendar']
    const allFieldsFilled = (value: DateTimeFormat): boolean => {
      return fields.every((field) => !!value && field in value && !!value[field])
    }

    const rules = [(value: DateTimeFormat): ValidationRule => allFieldsFilled(value) || t('All options must be set')]

    const submit = (): void => emit('submit', { code: 'general.date_format', payload: form.value })

    return {
      rules,
      submit,
      form
    }
  }
})
</script>
