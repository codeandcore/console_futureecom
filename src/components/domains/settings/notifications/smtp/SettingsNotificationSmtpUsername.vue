<template>
  <v-text-field v-model="username" v-bind="$attrs" :label="$t('Username')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpUsername',

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const username = computed({
      get: () => props.value.username,
      set: (username) => emit('input', { ...props.value, username })
    })

    return {
      username
    }
  }
})
</script>
