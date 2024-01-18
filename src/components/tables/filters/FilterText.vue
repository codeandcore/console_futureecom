<template>
  <v-text-field v-model="filter" v-bind="$attrs" hide-details="auto" dense outlined />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterText',

  props: {
    value: {
      type: String,
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
