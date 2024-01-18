<template>
  <v-text-field v-model="emailFrom" v-bind="$attrs" :label="$t('From Email')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationMailingSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationMailingEmailFrom',

  props: {
    value: {
      type: Object as PropType<NotificationMailingSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const emailFrom = computed({
      get: () => props.value.email_from,
      set: (email_from) => emit('input', { ...props.value, email_from })
    })

    return {
      emailFrom
    }
  }
})
</script>
