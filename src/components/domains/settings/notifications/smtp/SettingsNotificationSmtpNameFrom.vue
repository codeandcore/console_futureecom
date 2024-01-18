<template>
  <v-text-field v-model="nameFrom" v-bind="$attrs" :label="$t('Name from')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpNameFrom',

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const nameFrom = computed({
      get: () => props.value.name_from,
      set: (name_from) => emit('input', { ...props.value, name_from })
    })

    return {
      nameFrom
    }
  }
})
</script>
