<template>
  <v-text-field v-bind="$attrs" v-model="email" outlined :label="$t('Email')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { User } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'UserEmail',

  props: {
    value: {
      type: Object as PropType<User>,
      required: true
    }
  },

  setup(props, { emit }) {
    const email = computed({
      get: () => props.value.email,
      set: (email) => emit('input', { ...props.value, email })
    })

    return {
      email
    }
  }
})
</script>
