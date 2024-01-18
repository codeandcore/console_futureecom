<template>
  <v-select
    v-bind="$attrs"
    v-model="type"
    :label="$t('Type')"
    outlined
    :items="types"
    item-text="text"
    item-value="value"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentTranzila } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TranzilaType',

  props: {
    value: {
      type: Object as PropType<PaymentTranzila>,
      required: true
    }
  },

  setup(props, { emit }) {
    const types = computed(() => [
      { text: 'Token', value: 'token' },
      { text: 'Redirect', value: 'redirect' }
    ])

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type })
    })

    return {
      types,
      type
    }
  }
})
</script>
