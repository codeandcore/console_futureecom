<template>
  <v-combobox
    v-model="bccEmail"
    v-bind="$attrs"
    :label="$t('BCC Email')"
    outlined
    multiple
    chips
    clearable
    deletable-chips
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationMailingSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationMailingBccEmail',

  props: {
    value: {
      type: Object as PropType<NotificationMailingSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const bccEmail = computed({
      get: () => props.value.bcc_email,
      set: (bcc_email) => emit('input', { ...props.value, bcc_email })
    })

    return {
      bccEmail
    }
  }
})
</script>
