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
            <span class="text-caption mb-8">
              {{ $t('general.settings.timezone') }}
            </span>
            <general-settings-timezone-field v-model.trim="form.global" :rules="rules.global" :label="$t('Global')" />
            <general-settings-timezone-field v-model.trim="form.console" :label="$t('Console')" clearable />
            <general-settings-timezone-field v-model.trim="form.pos" :label="$t('PoS')" clearable />
            <general-settings-timezone-field v-model.trim="form.backend" :label="$t('Backend')" clearable />
            <span class="text-caption">
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
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingsTimezoneField from '@/components/domains/settings/general/timezone/GeneralSettingTimezoneField.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { GeneralSettingsResponse, TimezoneSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsTimezone',
  components: { Scrollable, FormValidatorWrapper, GeneralSettingsTimezoneField },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<TimezoneSettings>(structuredClone(props.value.timezone))

    const submit = (): void => emit('submit', { code: 'general.timezone', payload: form.value })

    const rules = {
      global: [(global: string): ValidationRule => useNotEmptyValidationRule(global)]
    }

    return {
      submit,
      form,
      rules
    }
  }
})
</script>
