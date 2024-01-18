<template>
  <v-text-field v-bind="$attrs" v-model.trim="email" :label="$t('Email')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerEmail',
  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },
  setup(props, { emit }) {
    const email = computed({
      get: () => props.value.email,
      set: (email) => emit('input', { ...props.value, email })
    })

    return {
      email
    }
  }
})
</script>
