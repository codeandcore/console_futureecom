<template>
  <div>
    <customer-subscription-email v-model="customer" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CustomerSubscriptionEmail from '@/components/domains/customers/customer/CustomerSubscriptionEmail.vue'
import type { CustomerResponse } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'CustomerSubscriptions',

  components: { CustomerSubscriptionEmail },

  props: {
    value: {
      type: Object as () => CustomerResponse,
      required: true
    }
  },

  setup(props, { emit }) {
    const customer = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      customer
    }
  }
})
</script>
