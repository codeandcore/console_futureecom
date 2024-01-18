<template>
  <switch-field v-bind="$attrs" v-model="integrationTesting" :label="$t('Integration testing')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PaymentConverge } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ConvergeIntegrationTesting',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<PaymentConverge>,
      required: true
    }
  },

  setup(props, { emit }) {
    const integrationTesting = computed({
      get: () => props.value.integrationTesting,
      set: (integrationTesting) => emit('input', { ...props.value, integrationTesting })
    })

    return {
      integrationTesting
    }
  }
})
</script>
