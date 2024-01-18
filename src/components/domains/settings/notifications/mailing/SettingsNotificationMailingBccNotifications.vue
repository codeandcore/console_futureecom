<template>
  <templates-combobox v-bind="$attrs" v-model="bccNotifications" :items="items" :label="$t('BCC Attachments')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TemplatesCombobox from '@/components/domains/settings/forms/TemplatesCombobox.vue'
import type { NotificationMailingSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationMailingBccNotifications',
  components: { TemplatesCombobox },

  props: {
    value: {
      type: Object as PropType<NotificationMailingSettings>,
      required: true
    },
    items: {
      type: Array as PropType<NotificationTemplate[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const bccNotifications = computed({
      get: () => props.value.bcc_notifications,
      set: (bcc_notifications) => emit('input', { ...props.value, bcc_notifications })
    })

    return {
      bccNotifications
    }
  }
})
</script>
