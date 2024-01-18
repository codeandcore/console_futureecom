<template>
  <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
    <template #scrollable-content>
      <div class="d-flex flex-column mx-6">
        <settings-notification-channels :value="value" />
      </div>

      <v-divider class="my-6" />

      <div class="d-flex flex-column mx-6">
        <settings-notification-mailing :value="value" :items="filterTemplates('mail')" />
      </div>

      <v-divider class="my-6" />

      <div class="mx-6 mb-8">
        <settings-notification-sms :value="value" :items="filterTemplates('vonage')" />
      </div>

      <v-divider class="my-6" />

      <div class="mx-6 mb-8">
        <settings-notification-smtp :value="value" />
      </div>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SettingsNotificationChannels from '@/components/domains/settings/notifications/SettingsNotificationChannels.vue'
import SettingsNotificationMailing from '@/components/domains/settings/notifications/SettingsNotificationMailing.vue'
import SettingsNotificationSms from '@/components/domains/settings/notifications/SettingsNotificationSms.vue'
import SettingsNotificationSmtp from '@/components/domains/settings/notifications/SettingsNotificationSmtp.vue'
import useApi from '@/composable/useApi'
import type { NotificationChannels, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotification',

  components: {
    SettingsNotificationSmtp,
    Scrollable,
    SettingsNotificationSms,
    SettingsNotificationMailing,
    SettingsNotificationChannels
  },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const templatesList = ref<NotificationTemplate[]>()

    const { canRead } = useCrudChecker('notifications\\template')

    if (canRead.value) {
      useApi()
        .notifications.templates({ perPage: -1 })
        .then((templates) => (templatesList.value = templates.data))
        .catch(() => addErrorToast(t('Unable to fetch notification templates')))
    }

    const filterTemplates = (channel: NotificationChannels): NotificationTemplate[] => {
      return (templatesList.value || []).filter((item: any) => item.channel === channel)
    }

    return {
      filterTemplates
    }
  }
})
</script>
