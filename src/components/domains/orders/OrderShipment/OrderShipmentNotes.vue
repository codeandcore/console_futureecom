<template>
  <v-text-field v-bind="$attrs" v-model="notes" hide-details="auto" outlined :label="$t('Notes')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentNotes',

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const notes = computed({
      get: () => props.value.notes,
      set: (notes) => emit('input', { ...props.value, notes })
    })

    return {
      notes
    }
  }
})
</script>
