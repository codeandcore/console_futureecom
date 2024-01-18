<template>
  <v-chip v-bind="$attrs" :color="color" label small dark>
    <slot>
      <span class="uppercase-first-letter">{{ $t(formatCodeToHumanText(value)) }}</span>
    </slot>
  </v-chip>
</template>

<script lang="ts">
import { OrderStatus } from '@futureecom/futureecom-js/dist/services/order-service'
import { computed } from '@vue/composition-api'
import { defineComponent } from '@vue/composition-api/dist/vue-composition-api'
import { formatCodeToHumanText } from '@/libs/domains/report/formatters'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderStatusChip',

  props: {
    value: {
      type: String as PropType<OrderStatus>,
      required: true
    }
  },

  setup(props) {
    const color = computed(() => {
      const colors: Record<OrderStatus | 'guest', string> = {
        placed: 'green darken-3',
        approved: 'green',
        processing: 'light-blue',
        on_hold: 'orange darken-1',
        refunded: 'deep-orange darken-1',
        shipped: 'indigo darken-3',
        canceled: 'grey darken-3',
        completed: 'light-green',
        guest: 'grey'
      }

      return colors[props.value] || 'grey'
    })

    return {
      color,
      formatCodeToHumanText
    }
  }
})
</script>
