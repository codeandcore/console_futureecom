<template>
  <v-text-field v-bind="$attrs" v-model.trim="firstname" :label="`${$t('First Name')}`" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerFirstName',

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const firstname = computed({
      get: () => props.value.firstname,
      set: (firstname) => emit('input', { ...props.value, firstname })
    })

    return {
      firstname
    }
  }
})
</script>
