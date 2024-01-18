<template>
  <v-text-field v-model.number="order" data-cy="order" :label="$t('Sort order')" outlined type="number" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SortOrderInput',
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    const order = computed({
      get: () => props.value,
      set: (val: number) => emit('input', val)
    })

    return {
      order
    }
  }
})
</script>
