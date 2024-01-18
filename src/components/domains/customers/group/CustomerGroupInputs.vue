<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <v-text-field v-model="form.name" :label="$t('Name')" :rules="rules.name" outlined />
        <v-text-field v-model="form.code" :label="$t('Code')" :rules="rules.code" outlined />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>{{ $t('Customers') }}</span>
        <selectable-customers v-model="form.customer_ids" :items="value.customers || []" :select-ids="true" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useNotEmptyValidationRule, useNotWhitespaceValidationRule } from '@/composable/validationRules'
import SelectableCustomers from '@/components/common/selectables/SelectableCustomers.vue'
import type { CustomerGroup } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'CustomerGroupInputs',

  components: { SelectableCustomers },

  props: {
    value: {
      type: Object as () => CustomerGroup,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<CustomerGroup>(props.value)

    const rules = {
      name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
      code: props.value.code
        ? [
            (code: string): ValidationRule => useNotEmptyValidationRule(code),
            (code: string): ValidationRule => useNotWhitespaceValidationRule(code)
          ]
        : [(code: string): ValidationRule => useNotWhitespaceValidationRule(code)]
    }

    watch([form], () => emit('input', form.value), { deep: true })

    return {
      form,
      rules
    }
  }
})
</script>
