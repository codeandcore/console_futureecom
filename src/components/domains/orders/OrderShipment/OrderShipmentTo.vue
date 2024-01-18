<template>
  <customer-address-inputs v-model="to" is-guest />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CustomerAddressInputs from '@/components/domains/customers/customer/CustomerAddressInputs.vue'
import type { OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentTo',
  components: { CustomerAddressInputs },

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const to = computed({
      get: () => props.value.to,
      set: (to) => emit('input', { ...props.value, to })
    })

    return {
      to
    }
  }
})
</script>
