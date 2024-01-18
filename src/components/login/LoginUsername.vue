<template>
  <v-text-field v-bind="$attrs" v-model="username" outlined :label="$t('Email')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { TokenRequestPassword } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'LoginUsername',

  props: {
    value: {
      type: Object as PropType<TokenRequestPassword>,
      required: true
    }
  },

  setup(props, { emit }) {
    const username = computed({
      get: () => props.value.username,
      set: (username) => emit('input', { ...props.value, username })
    })

    return {
      username
    }
  }
})
</script>
