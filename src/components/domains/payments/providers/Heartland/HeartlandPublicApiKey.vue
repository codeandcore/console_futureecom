<template>
  <v-text-field v-bind="$attrs" v-model="publicApiKey" :label="$t('Public API Key')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentHeartland } from '@/types/plugins/HeartlandPayment'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'HeartlandPublicApiKey',

  props: {
    value: {
      type: Object as PropType<PaymentHeartland>,
      required: true
    }
  },

  setup(props, { emit }) {
    const publicApiKey = computed({
      get: () => props.value.publicApiKey,
      set: (publicApiKey) => emit('input', { ...props.value, publicApiKey })
    })

    return {
      publicApiKey
    }
  }
})
</script>
