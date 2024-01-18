<template>
  <switch-field v-model="email" :label="$t('Subscribe for marketing emails')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerSubscriptionEmail',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const email = computed({
      get: () => props.value.subscription && props.value.subscription.email,
      set: (email) => emit('input', { ...props.value, subscription: { ...props.value.subscription, email } })
    })

    return {
      email
    }
  }
})
</script>
