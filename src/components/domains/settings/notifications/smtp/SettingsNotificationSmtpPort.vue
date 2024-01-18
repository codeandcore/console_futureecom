<template>
  <v-text-field v-model="port" v-bind="$attrs" :label="$t('Port')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpPort',

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const port = computed({
      get: () => props.value.port,
      set: (port) => emit('input', { ...props.value, port })
    })

    return {
      port
    }
  }
})
</script>
