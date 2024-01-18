<template>
  <v-text-field v-model="from" v-bind="$attrs" :label="$t('From Name/Number')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSMSSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmsFrom',

  props: {
    value: {
      type: Object as PropType<NotificationSMSSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const from = computed({
      get: () => props.value.from,
      set: (from) => emit('input', { ...props.value, from })
    })

    return {
      from
    }
  }
})
</script>
