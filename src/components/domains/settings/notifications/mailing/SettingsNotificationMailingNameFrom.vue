<template>
  <v-text-field v-model="nameFrom" v-bind="$attrs" :label="$t('From Name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { NotificationMailingSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationMailingNameFrom',

  props: {
    value: {
      type: Object as PropType<NotificationMailingSettings>,
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
