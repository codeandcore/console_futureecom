<template>
  <v-text-field v-bind="$attrs" v-model="username" :label="$t('Username')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentConverge } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ConvergeUsername',

  props: {
    value: {
      type: Object as PropType<PaymentConverge>,
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
