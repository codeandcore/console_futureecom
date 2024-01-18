<template>
  <v-text-field v-bind="$attrs" v-model="given_name" :label="$t('First name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressFirstName',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const given_name = computed({
      get: () => props.value.given_name,
      set: (given_name) => emit('input', { ...props.value, given_name })
    })

    return {
      given_name
    }
  }
})
</script>
