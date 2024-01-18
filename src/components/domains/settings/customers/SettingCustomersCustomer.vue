<template>
  <div class="d-flex flex-gap-16 flex-column">
    <setting-customers-customer-registration-disabled v-model="customer" />
    <setting-customers-customer-default-group v-model="customer" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SettingCustomersCustomerDefaultGroup from '@/components/domains/settings/customers/customer/SettingCustomersCustomerDefaultGroup.vue'
import SettingCustomersCustomerRegistrationDisabled from '@/components/domains/settings/customers/customer/SettingCustomersCustomerRegistrationDisabled.vue'
import type { CustomersSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingCustomersCustomer',
  components: { SettingCustomersCustomerDefaultGroup, SettingCustomersCustomerRegistrationDisabled },

  props: {
    value: {
      type: Object as PropType<CustomersSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const customer = computed({
      get: () => props.value.customer,
      set: (customer) => emit('input', { ...props.value, customer })
    })

    return {
      customer
    }
  }
})
</script>
