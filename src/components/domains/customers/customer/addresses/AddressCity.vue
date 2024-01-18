<template>
  <v-text-field v-bind="$attrs" v-model="locality" :label="$t('City')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressCity',
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const locality = computed({
      get: () => props.value.locality,
      set: (locality) => emit('input', { ...props.value, locality })
    })

    return {
      locality
    }
  }
})
</script>
