<template>
  <v-select v-bind="$attrs" v-model="type" outlined :items="feeTypes" :label="$t('Type')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoFeeType, ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoFeeType',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['fee']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const feeTypes: ShippoFeeType[] = ['percent', 'fixed']

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type, amount: '' })
    })

    return {
      type,
      feeTypes
    }
  }
})
</script>
