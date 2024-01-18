<template>
  <v-text-field v-model="key" v-bind="$attrs" :label="$t('Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSMSSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmsKey',

  props: {
    value: {
      type: Object as PropType<NotificationSMSSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const key = computed({
      get: () => props.value.key,
      set: (key) => emit('input', { ...props.value, key })
    })

    return {
      key
    }
  }
})
</script>
