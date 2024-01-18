<template>
  <v-text-field
    v-model="rate"
    :label="`${$t('Rate')} (%)`"
    outlined
    v-bind="$attrs"
    type="number"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import movePointerPosition from '@/libs/movePointerPosition'
import type { PropType } from '@vue/composition-api'
import type { TaxRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'SaleTaxRate',

  props: {
    value: {
      type: Object as PropType<TaxRate>,
      required: true
    }
  },

  setup(props, { emit }) {
    const rate = computed({
      get: () => {
        return props.value.rate ? `${Number(movePointerPosition(props.value.rate, 2))}` : props.value.rate
      },
      set: (val) => emit('input', { ...props.value, rate: val !== '' ? Number(movePointerPosition(val, -2)) : '' })
    })

    return {
      rate
    }
  }
})
</script>
