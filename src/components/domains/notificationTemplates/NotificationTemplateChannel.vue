<template>
  <v-select
    v-bind="$attrs"
    v-model="channel"
    :label="$t('Channel')"
    outlined
    hide-details="auto"
    :items="channels"
    item-text="text"
    item-value="value"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'NotificationTemplateChannel',

  props: {
    value: {
      type: Object as PropType<NotificationTemplate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const channel = computed({
      get: () => props.value.channel,
      set: (channel) => emit('input', { ...props.value, channel })
    })

    const channels = computed((root) => [
      { text: root.$t('Mail'), value: 'mail' },
      { text: root.$t('SMS'), value: 'vonage' }
    ])

    return {
      channel,
      channels
    }
  }
})
</script>
