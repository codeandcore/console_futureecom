<template>
  <v-text-field v-bind="$attrs" v-model="applicationId" :label="$t('Application ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentPoynt, PaymentPoyntTerminal } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PoyntApplicationId',

  props: {
    value: {
      type: Object as PropType<PaymentPoynt | PaymentPoyntTerminal>,
      required: true
    }
  },

  setup(props, { emit }) {
    const applicationId = computed({
      get: () => props.value.application_id,
      set: (application_id) => emit('input', { ...props.value, application_id })
    })

    return {
      applicationId
    }
  }
})
</script>
