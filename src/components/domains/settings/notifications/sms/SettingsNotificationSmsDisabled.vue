<template>
  <templates-combobox v-bind="$attrs" v-model="disabled" :items="items" :label="$t('Disabled Templates')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TemplatesCombobox from '@/components/domains/settings/forms/TemplatesCombobox.vue'
import type { NotificationSMSSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmsDisabled',

  components: { TemplatesCombobox },

  props: {
    value: {
      type: Object as PropType<NotificationSMSSettings>,
      required: true
    },
    items: {
      type: Array as PropType<NotificationTemplate[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const disabled = computed({
      get: () => props.value.disabled,
      set: (disabled) => emit('input', { ...props.value, disabled })
    })

    return {
      disabled
    }
  }
})
</script>
