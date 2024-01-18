<template>
  <v-text-field v-bind="$attrs" v-model="secretApiKey" :label="$t('Secret API Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentHeartland } from '@/types/plugins/HeartlandPayment'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'HeartlandSecretApiKey',

  props: {
    value: {
      type: Object as PropType<PaymentHeartland>,
      required: true
    }
  },

  setup(props, { emit }) {
    const secretApiKey = computed({
      get: () => props.value.secretApiKey,
      set: (secretApiKey) => emit('input', { ...props.value, secretApiKey })
    })

    return {
      secretApiKey
    }
  }
})
</script>
