<template>
  <v-text-field
    v-model.number="vatValue"
    :label="`${$t('Tax Rate')} (%)`"
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
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateValue',
  props: {
    value: {
      type: Object as PropType<Vat>,
      required: true
    }
  },

  setup(props, { emit }) {
    const vatValue = computed({
      get: () => {
        return props.value.value ? `${Number(movePointerPosition(props.value.value, 2))}` : props.value.value
      },
      set: (val) => emit('input', { ...props.value, value: val !== '' ? Number(movePointerPosition(val, -2)) : '' })
    })

    return {
      vatValue
    }
  }
})
</script>
