<template>
  <v-chip v-bind="$attrs" :color="color" small dark>
    <slot>
      <span class="uppercase-first-letter">{{ $t(value) }}</span>
    </slot>
  </v-chip>
</template>

<script lang="ts">
import { QuoteStatus } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed } from '@vue/composition-api'
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'QuoteStatusChip',

  props: {
    value: {
      type: String as PropType<QuoteStatus>,
      required: true
    }
  },

  setup(props) {
    const color = computed(() => {
      const colors: Record<QuoteStatus, string> = {
        pending: 'light-blue',
        processing: 'light-blue',
        available: 'lime accent-4',
        rejected: 'blue-grey-lighten-1',
        adjusting: 'deep-orange darken-1',
        approved: 'green',
        closed: 'grey darken-3',
        errored: 'red'
      }

      return colors[props.value]
    })

    return {
      color
    }
  }
})
</script>
