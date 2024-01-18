<template>
  <div v-if="value.note" class="d-flex flex-column">
    <span class="mt-2">{{ value.note }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewNote',

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  }
})
</script>
