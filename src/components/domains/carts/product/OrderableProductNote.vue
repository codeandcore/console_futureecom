<template>
  <v-text-field v-bind="$attrs" v-model="notes" clearable outlined :label="$t('Note')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { UpdateOrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'OrderableProductNote',

  props: {
    value: {
      type: Object as PropType<Pick<UpdateOrderableItem, 'notes'>>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const notes = computed({
      get: () => (Array.isArray(props.value?.notes) ? props.value?.notes[0] : ''),
      set: (notes: string) => emit('input', { ...props.value, notes: notes ? [notes] : null })
    })

    return {
      notes
    }
  }
})
</script>
