<template>
  <switch-field v-model="enabled" v-bind="$attrs" :label="$t('Enabled')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpEnabled',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const enabled = computed({
      get: () => props.value.enabled,
      set: (enabled) => emit('input', { ...props.value, enabled })
    })

    return {
      enabled
    }
  }
})
</script>
