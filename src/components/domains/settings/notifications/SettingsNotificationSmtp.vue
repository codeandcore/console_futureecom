<template>
  <div>
    <h2>
      {{ $t('SMTP') }}
    </h2>

    <form-validator-wrapper class="mt-4" @submit="updateHandler">
      <template #default="{ valid }">
        <div class="d-flex flex-column flex-gap-16">
          <settings-notification-smtp-enabled v-model="form" />
          <settings-notification-smtp-tls v-model="form" />
          <settings-notification-smtp-host v-model="form" :rules="rules.host" class="required" />
          <settings-notification-smtp-port v-model="form" :rules="rules.port" class="required" />
          <settings-notification-smtp-email-from v-model="form" :rules="rules.email_from" class="required" />
          <settings-notification-smtp-name-from v-model="form" />
          <settings-notification-smtp-username v-model="form" />
          <settings-notification-smtp-password v-model="form" />
          <div class="d-flex justify-end">
            <v-btn small depressed color="primary" :disabled="!valid || !canUpdate" :loading="loading" type="submit">
              {{ $t('Update SMTP') }}
            </v-btn>
          </div>
        </div>
      </template>
    </form-validator-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useEmailValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { useI18n } from 'vue-i18n-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import SettingsNotificationSmtpEmailFrom from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpEmailFrom.vue'
import SettingsNotificationSmtpEnabled from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpEnabled.vue'
import SettingsNotificationSmtpHost from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpHost.vue'
import SettingsNotificationSmtpNameFrom from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpNameFrom.vue'
import SettingsNotificationSmtpPassword from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpPassword.vue'
import SettingsNotificationSmtpPort from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpPort.vue'
import SettingsNotificationSmtpTls from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpTls.vue'
import SettingsNotificationSmtpUsername from '@/components/domains/settings/notifications/smtp/SettingsNotificationSmtpUsername.vue'
import type { NotificationSmtpSettings, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'SettingsNotificationSmtp',

  components: {
    SettingsNotificationSmtpNameFrom,
    SettingsNotificationSmtpPassword,
    SettingsNotificationSmtpUsername,
    SettingsNotificationSmtpEmailFrom,
    SettingsNotificationSmtpPort,
    SettingsNotificationSmtpHost,
    SettingsNotificationSmtpTls,
    SettingsNotificationSmtpEnabled,
    FormValidatorWrapper
  },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)

    const settingTemplate = () => ({
      enabled: true,
      tls: true,
      host: '',
      port: '',
      email_from: '',
      name_from: null,
      username: null,
      password: null
    })

    const form = ref<NotificationSmtpSettings>({ ...settingTemplate(), ...props.value.notifications?.smtp })

    const { canUpdate } = useCrudChecker('settings\\notifications')

    const rules = {
      host: [(host: string): ValidationRule => useNotEmptyValidationRule(host)],
      port: [(port: string): ValidationRule => useNotEmptyValidationRule(port)],
      email_from: [
        (emailFrom: string): ValidationRule => useNotEmptyValidationRule(emailFrom),
        (emailFrom: string): ValidationRule => useEmailValidationRule(emailFrom)
      ]
    }

    const updateHandler = (): void => {
      loading.value = true
      useSettings()
        .updateSettings('notifications.smtp', { ...form.value, port: `${form.value.port}` })
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
