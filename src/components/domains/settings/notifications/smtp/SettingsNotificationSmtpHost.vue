<template>
  <v-text-field v-model="host" v-bind="$attrs" :label="$t('Host')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpHost',

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const host = computed({
      get: () => props.value.host,
      set: (host) => emit('input', { ...props.value, host })
    })

    return {
      host
    }
  }
})
</script>
