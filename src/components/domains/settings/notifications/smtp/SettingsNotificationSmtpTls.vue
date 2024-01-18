<template>
  <switch-field v-model="tls" v-bind="$attrs" :label="$t('TLS')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpTls',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tls = computed({
      get: () => props.value.tls,
      set: (tls) => emit('input', { ...props.value, tls })
    })

    return {
      tls
    }
  }
})
</script>
