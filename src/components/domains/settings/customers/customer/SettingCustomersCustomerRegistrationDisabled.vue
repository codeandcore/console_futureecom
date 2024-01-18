<template>
  <switch-field v-model="registrationDisabled" :label="$t('Registration disabled')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CustomersSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingCustomersCustomerRegistrationDisabled',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<CustomersSettings['customer']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const registrationDisabled = computed({
      get: () => props.value.registration_disabled,
      set: (registration_disabled) => emit('input', { ...props.value, registration_disabled })
    })

    return {
      registrationDisabled
    }
  }
})
</script>
