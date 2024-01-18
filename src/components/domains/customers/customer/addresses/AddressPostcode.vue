<template>
  <v-text-field v-bind="$attrs" v-model="postal_code" :label="$t('Postcode')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressPostcode',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const postal_code = computed({
      get: () => props.value.postal_code,
      set: (postal_code) => emit('input', { ...props.value, postal_code })
    })

    return {
      postal_code
    }
  }
})
</script>
