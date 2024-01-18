<template>
  <switch-field v-model="enabled" :label="$t('Enabled')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { BasePaymentMethod } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentMethodEnabled',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<BasePaymentMethod>,
      required: true
    }
  },

  setup(props, { emit }) {
    const enabled = computed({
      get: () => props.value.enabled,
      set: (enabled) => emit('input', { ...props.value, enabled })
    })

    return {
      enabled
    }
  }
})
</script>
