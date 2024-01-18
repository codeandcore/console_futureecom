<template>
  <templates-combobox v-bind="$attrs" v-model="disabledAttachment" :items="items" :label="$t('Disabled Attachments')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TemplatesCombobox from '@/components/domains/settings/forms/TemplatesCombobox.vue'
import type { NotificationMailingSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationMailingDisabledAttachments',
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
    const disabledAttachment = computed({
      get: () => props.value.disabled_attachment,
      set: (disabled_attachment) => emit('input', { ...props.value, disabled_attachment })
    })

    return {
      disabledAttachment
    }
  }
})
</script>
