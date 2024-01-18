<template>
  <select-application v-bind="$attrs" v-model="application" multiple hide-details="auto" :app-types="appTypes" />
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js'
import { arrayOrNull } from '@/libs/arrays'
import { computed, defineComponent } from '@vue/composition-api'
import SelectApplication from '@/components/common/selectables/SelectApplication.vue'
import type {
  BasePaymentMethod,
  PaymentMethodAllowedApplication
} from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentMethodApplication',

  components: { SelectApplication },

  props: {
    value: {
      type: Object as PropType<BasePaymentMethod>,
      required: true
    }
  },

  setup(props, { emit }) {
    const application = computed({
      get: () => props.value.application,
      set: (application: undefined | null | PaymentMethodAllowedApplication[]) => {
        emit('input', { ...props.value, application: arrayOrNull(application) })
      }
    })

    return {
      application,
      appTypes: [ApplicationType.CONSOLE, ApplicationType.STOREFRONT, ApplicationType.POS]
    }
  }
})
</script>
