<template>
  <v-text-field v-bind="$attrs" v-model="street" outlined :label="$t('Street')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressStreet',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const street = computed({
      get: () => props.value?.street || '',
      set: (street) => emit('input', { ...props.value, street })
    })

    return {
      street
    }
  }
})
</script>
