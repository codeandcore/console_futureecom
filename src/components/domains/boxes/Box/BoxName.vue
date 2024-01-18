<template>
  <v-text-field v-bind="$attrs" v-model="name" :label="$t('Name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Box } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BoxName',

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const name = computed({
      get: () => props.value.name,
      set: (name) => emit('input', { ...props.value, name })
    })

    return {
      name
    }
  }
})
</script>
