<template>
  <v-text-field v-model="secret" v-bind="$attrs" :label="$t('Secret')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSMSSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmsSecret',

  props: {
    value: {
      type: Object as PropType<NotificationSMSSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const secret = computed({
      get: () => props.value.secret,
      set: (secret) => emit('input', { ...props.value, secret })
    })

    return {
      secret
    }
  }
})
</script>
