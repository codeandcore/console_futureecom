<template>
  <div class="d-flex flex-column flex-grow-1 my-2">
    <span v-if="value.message" class="text-caption error--text">{{ value.message }}</span>
    <span v-if="value.reason" class="text-caption grey--text">{{ value.reason }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { OrderableErrorProductReasonMessage } from '@/types/Orderable'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableErrorReasonMessage',

  props: {
    value: {
      type: Object as PropType<OrderableErrorProductReasonMessage>,
      required: true
    }
  }
})
</script>
