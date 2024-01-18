<template>
  <v-text-field v-bind="$attrs" v-model="family_name" :label="$t('Last name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressLastName',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const family_name = computed({
      get: () => props.value.family_name,
      set: (family_name) => emit('input', { ...props.value, family_name })
    })

    return {
      family_name
    }
  }
})
</script>
