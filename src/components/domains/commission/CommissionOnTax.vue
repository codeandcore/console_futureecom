<template>
  <switch-field v-bind="$attrs" v-model="commissionOnTax" :label="$t('Commission on tax')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { RecalculateCommission } from '@futureecom/futureecom-js/dist/services/commission-service'

export default defineComponent({
  name: 'CommissionOnTax',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<RecalculateCommission>,
      required: true
    }
  },

  setup(props, { emit }) {
    const commissionOnTax = computed({
      get: () => props.value.commission_on_tax,
      set: (commission_on_tax) => emit('input', { ...props.value, commission_on_tax })
    })

    return {
      commissionOnTax
    }
  }
})
</script>
