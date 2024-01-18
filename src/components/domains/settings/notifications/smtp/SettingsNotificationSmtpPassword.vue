<template>
  <password-field v-bind="$attrs" v-model="password" hide-details="auto" outlined :label="$t('Password')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PasswordField from '@/components/common/PasswordField.vue'
import type { NotificationSmtpSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsNotificationSmtpPassword',
  components: { PasswordField },

  props: {
    value: {
      type: Object as PropType<NotificationSmtpSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const password = computed({
      get: () => props.value.password || '',
      set: (password) => emit('input', { ...props.value, password })
    })

    return {
      password
    }
  }
})
</script>
