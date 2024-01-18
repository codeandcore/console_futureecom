<template>
  <v-text-field v-bind="$attrs" v-model.trim="lastname" :label="`${$t('Last Name')}`" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerLastName',
  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },
  setup(props, { emit }) {
    const lastname = computed({
      get: () => props.value.lastname,
      set: (lastname) => emit('input', { ...props.value, lastname })
    })

    return {
      lastname
    }
  }
})
</script>
