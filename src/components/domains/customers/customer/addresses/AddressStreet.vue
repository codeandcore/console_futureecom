<template>
  <v-text-field v-bind="$attrs" v-model="address_line1" :label="$t('Street')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressStreet',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const address_line1 = computed({
      get: () => props.value.address_line1,
      set: (address_line1) => emit('input', { ...props.value, address_line1 })
    })

    return {
      address_line1
    }
  }
})
</script>
