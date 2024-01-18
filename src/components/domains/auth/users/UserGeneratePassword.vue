<template>
  <switch-field v-bind="$attrs" v-model="generate_password" :label="$t('Generate password')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserGeneratePassword',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    }
  },

  setup(props, { emit }) {
    const generate_password = computed({
      //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-480
      get: () => props.value.generate_password || '',
      set: (generate_password) => {
        emit('input', { ...props.value, generate_password, password: undefined, password_confirmation: undefined })
      }
    })

    return {
      generate_password
    }
  }
})
</script>
