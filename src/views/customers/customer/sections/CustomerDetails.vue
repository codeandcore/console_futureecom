<template>
  <div class="d-flex flex-column justify-center flex-gap-16">
    <customer-first-name v-model="customer" :rules="rules.firstname" class="required" />
    <customer-last-name v-model="customer" :rules="rules.lastname" class="required" />
    <customer-email v-model="customer" :rules="rules.email" class="required" />
    <customer-dob v-model="customer" />
    <customer-telephone v-model="customer" />
    <customer-avalara-entity-use-code v-model="customer" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useEmailValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import AvalaraEntityUseCode from '@/components/common/AvalaraEntityUseCode.vue'
import CustomerDob from '@/components/domains/customers/customer/CustomerDob.vue'
import CustomerEmail from '@/components/domains/customers/customer/CustomerEmail.vue'
import CustomerFirstName from '@/components/domains/customers/customer/CustomerFirstName.vue'
import CustomerLastName from '@/components/domains/customers/customer/CustomerLastName.vue'
import CustomerTelephone from '@/components/domains/customers/customer/CustomerTelephone.vue'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CustomerDetails',

  components: {
    CustomerTelephone,
    CustomerDob,
    CustomerEmail,
    CustomerLastName,
    CustomerFirstName,
    CustomerAvalaraEntityUseCode: AvalaraEntityUseCode
  },

  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const customer = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      firstname: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      lastname: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      email: [
        (val: string): ValidationRule => useNotEmptyValidationRule(val),
        (val: string): ValidationRule => useEmailValidationRule(val)
      ]
    }

    return {
      customer,
      rules
    }
  }
})
</script>
