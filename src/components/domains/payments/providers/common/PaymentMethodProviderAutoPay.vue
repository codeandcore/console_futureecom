<template>
  <switch-field
    v-bind="$attrs"
    v-model="autoPay"
    :label="$t('Auto Pay')"
    persistent-hint
    :hint="$t('It will mark your order as paid automatically once it is placed')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentMethodProviderAutoPay',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<{ auto_pay?: boolean }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const autoPay = computed({
      get: () => props.value.auto_pay,
      set: (auto_pay) => emit('input', { ...props.value, auto_pay })
    })

    return {
      autoPay
    }
  }
})
</script>
