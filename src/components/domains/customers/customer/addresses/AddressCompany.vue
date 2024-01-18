<template>
  <v-text-field v-bind="$attrs" v-model="organization" :label="$t('Company')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressCompany',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const organization = computed({
      get: () => props.value.organization,
      set: (organization) => emit('input', { ...props.value, organization })
    })

    return {
      organization
    }
  }
})
</script>
