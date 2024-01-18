<template>
  <v-select v-model="filter" v-bind="$attrs" hide-details="auto" clearable dense outlined />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterSelectMultiple',

  props: {
    value: {
      type: [] as PropType<string[] | null | undefined>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const filter = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      filter
    }
  }
})
</script>
