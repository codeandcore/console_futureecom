<template>
  <password-field v-bind="$attrs" v-model="secret" hide-details="auto" outlined :label="$t('Secret')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import PasswordField from '@/components/common/PasswordField.vue'
import type { PropType } from '@vue/composition-api'
import type { WebhookData } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookSecret',
  components: { PasswordField },

  props: {
    value: {
      type: Object as PropType<WebhookData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const secret = computed({
      get: () => props.value.secret,
      set: (secret) => emit('input', { ...props.value, secret })
    })

    return {
      secret
    }
  }
})
</script>
