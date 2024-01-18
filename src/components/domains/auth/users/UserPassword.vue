<template>
  <div class="d-flex flex-column flex-gap-16">
    <password-field v-bind="$attrs" v-model="password" hide-details="auto" outlined :label="$t('Password')" />

    <div class="d-flex flex-gap-16 flex-fill">
      <generate-password-action :label="$t('Fill password')" small @input="password = $event" />
      <v-slide-y-reverse-transition mode="out-in">
        <password-strength v-if="password" :value="password" />
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import GeneratePasswordAction from '@/components/common/actions/GeneratePasswordAction.vue'
import PasswordField from '@/components/common/PasswordField.vue'
import PasswordStrength from '@/components/common/PasswordStrength.vue'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'UserPassword',

  components: { GeneratePasswordAction, PasswordStrength, PasswordField },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<{ password?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const password = computed({
      get: () => props.value.password || '',
      set: (password) => emit('input', { ...props.value, password, password_confirmation: password })
    })

    return {
      password
    }
  }
})
</script>
