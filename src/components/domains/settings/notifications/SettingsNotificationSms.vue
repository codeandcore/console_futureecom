<template>
  <div>
    <h2>
      {{ $t('SMS') }}
    </h2>

    <form-validator-wrapper class="mt-4" @submit="updateHandler">
      <template #default="{ valid }">
        <div class="d-flex flex-column flex-gap-16">
          <div class="text-caption">
            <h3>
              {{ $t('Vonage SMS Credentials') }}
            </h3>
            <span>{{ $t('Vonage SMS gateway configuration required for properly working SMS notifications.') }}</span>
          </div>

          <settings-notification-sms-key v-model="form" :rules="rules.key" />
          <settings-notification-sms-secret v-model="form" :rules="rules.secret" />
          <settings-notification-sms-from v-model="form" :rules="rules.from" />

          <span class="text-caption">
            {{ $t('Configure from what name/number system SMS messages should be send.') }}
          </span>

          <settings-notification-sms-disabled v-model="form" :items="items" />

          <span class="text-caption">
            {{ $t('List of disabled SMS notifications.') }}
          </span>
        </div>

        <div class="d-flex justify-end">
          <v-btn small depressed color="primary" :disabled="!valid || !canUpdate" :loading="loading" type="submit">
            {{ $t('Update SMS ') }}
          </v-btn>
        </div>
      </template>
    </form-validator-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useSettings } from '@/composable/repositories/useSettings'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import SettingsNotificationSmsDisabled from '@/components/domains/settings/notifications/sms/SettingsNotificationSmsDisabled.vue'
import SettingsNotificationSmsFrom from '@/components/domains/settings/notifications/sms/SettingsNotificationSmsFrom.vue'
import SettingsNotificationSmsKey from '@/components/domains/settings/notifications/sms/SettingsNotificationSmsKey.vue'
import SettingsNotificationSmsSecret from '@/components/domains/settings/notifications/sms/SettingsNotificationSmsSecret.vue'
import type { NotificationSMSSettings, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'SettingsNotificationSms',

  components: {
    SettingsNotificationSmsDisabled,
    SettingsNotificationSmsFrom,
    SettingsNotificationSmsSecret,
    SettingsNotificationSmsKey,
    FormValidatorWrapper
  },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    },
    items: {
      type: Array as PropType<NotificationTemplate[]>,
      default: () => []
    }
  },

  setup(props) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)

    const settingTemplate = () => ({
      from: '',
      disabled: null,
      key: '',
      secret: ''
    })

    const form = ref<NotificationSMSSettings>({ ...settingTemplate(), ...props.value.notifications?.sms })

    const { canUpdate } = useCrudChecker('settings\\notifications')

    const rules = {
      key: [(key: string): ValidationRule => useNotEmptyValidationRule(key)],
      secret: [(secret: string): ValidationRule => useNotEmptyValidationRule(secret)],
      from: [(from: string): ValidationRule => useNotEmptyValidationRule(from)]
    }

    const updateHandler = (): void => {
      loading.value = true
      useSettings()
        .updateSettings('notifications.sms', form.value)
        .then(() => addSuccessToast(t('Updated settings')))
        .catch(() => addErrorToast(t('Unable to update settings')))
        .finally(() => (loading.value = false))
    }

    return {
      form,
      rules,
      loading,
      canUpdate,
      updateHandler
    }
  }
})
</script>
