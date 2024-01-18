<template>
  <v-text-field v-model="text" :label="$t('Leave a comment...')" outlined hide-details="auto" v-bind="$attrs" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { BaseOrderComment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderCommentText',

  props: {
    value: {
      type: Object as PropType<BaseOrderComment>,
      required: true
    }
  },

  setup(props, { emit }) {
    const text = computed({
      get: () => props.value.text,
      set: (text: string) => emit('input', { ...props.value, text })
    })

    return {
      text
    }
  }
})
</script>
