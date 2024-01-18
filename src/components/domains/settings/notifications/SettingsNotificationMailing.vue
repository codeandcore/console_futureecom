<template>
  <div>
    <h2>
      {{ $t('Mailing') }}
    </h2>

    <form-validator-wrapper class="mt-4" @submit="updateHandler">
      <template #default="{ valid }">
        <div>
          <div class="d-flex flex-column flex-gap-16">
            <div class="text-caption">
              <h3>{{ $t('Emails "from"') }}</h3>
              <span>{{ $t('Configure from what address system emails should be send.') }}</span>
            </div>

            <settings-notification-mailing-email-from v-model="form" :rules="rules.email_from" />
            <settings-notification-mailing-name-from v-model="form" />
          </div>

          <v-divider class="my-6" />

          <div class="d-flex flex-column flex-gap-16">
            <div class="text-caption">
              <h3>{{ $t('Emails BCC') }}</h3>
              <span>{{ $t('Configure BCC email and list of templates that should use it.') }}</span>
            </div>

            <settings-notification-mailing-bcc-email v-model="form" :rules="rules.bcc_email" />
            <settings-notification-mailing-bcc-notifications v-model="form" :items="items" />
          </div>
        </div>

        <v-divider class="my-6" />

        <div class="d-flex flex-column flex-gap-16">
          <div class="text-caption">
            <h3>{{ $t('Disabling email notifications') }}</h3>
            <span>{{ $t('List of disabled emails notifications or emails attachments.') }}</span>
          </div>

          <settings-notification-mailing-disabled-templates v-model="form" :items="items" />
          <settings-notification-mailing-disabled-attachments v-model="form" :items="items" />
        </div>

        <div class="d-flex justify-end mt-8">
          <v-btn small depressed color="primary" :disabled="!valid || !canUpdate" :loading="loading" type="submit">
            {{ $t('Update mailing ') }}
          </v-btn>
        </div>
      </template>
    </form-validator-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useEmailValidationRule } from '@/composable/validationRules'
import { useI18n } from 'vue-i18n-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import SettingsNotificationMailingBccEmail from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingBccEmail.vue'
import SettingsNotificationMailingBccNotifications from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingBccNotifications.vue'
import SettingsNotificationMailingDisabledAttachments from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingDisabledAttachments.vue'
import SettingsNotificationMailingDisabledTemplates from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingDisabledTemplates.vue'
import SettingsNotificationMailingEmailFrom from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingEmailFrom.vue'
import SettingsNotificationMailingNameFrom from '@/components/domains/settings/notifications/mailing/SettingsNotificationMailingNameFrom.vue'
import type { NotificationMailingSettings, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'SettingsNotificationMailing',
  components: {
    SettingsNotificationMailingDisabledAttachments,
    SettingsNotificationMailingDisabledTemplates,
    SettingsNotificationMailingBccNotifications,
    SettingsNotificationMailingBccEmail,
    SettingsNotificationMailingNameFrom,
    SettingsNotificationMailingEmailFrom,
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
      email_from: null,
      name_from: null,
      bcc_email: null,
      bcc_notifications: null,
      disabled: null,
      disabled_attachment: null
    })

    const form = ref<NotificationMailingSettings>({ ...settingTemplate(), ...props.value.notifications?.mailing })

    const { canUpdate } = useCrudChecker('settings\\notifications')

    const rules = {
      email_from: [(emailFrom: string): ValidationRule => !emailFrom || useEmailValidationRule(emailFrom || '')],
      bcc_email: [
        (bccEmail: string[]): ValidationRule => {
          return (
            (bccEmail || [])
              .reduce((previous: string[], current: string) => {
                const result = useEmailValidationRule(current)
                return typeof result !== 'string' ? [...previous] : [...previous, `${result}: ${current}`]
              }, [])
              .join(', ') || true
          )
        }
      ]
    }

    const updateHandler = (): void => {
      loading.value = true
      useSettings()
        .updateSettings('notifications.mailing', form.value)
        .then(() => addSuccessToast(t('Updated settings')))
        .catch(() => addErrorToast(t('Unable to update settings')))
        .finally(() => (loading.value = false))
    }

    return {
      form,
      loading,
      canUpdate,
      updateHandler,
      rules
    }
  }
})
</script>
