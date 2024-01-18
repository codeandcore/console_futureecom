<template>
  <div>
    <v-icon v-if="value.gte === undefined">all_inclusive</v-icon>
    <template v-else>
      <span v-if="type === 'money-range'">
        {{ $format.money.withStoreCurrency({ amount: value.gte, currency: '' }) }}
      </span>
      <span v-else>
        {{ value.gte }}
      </span>
    </template>
    <span class="mx-1">-</span>
    <v-icon v-if="value.lte === undefined">all_inclusive</v-icon>
    <template v-else>
      <span v-if="type === 'money-range'">
        {{ $format.money.withStoreCurrency({ amount: value.lte, currency: '' }) }}
      </span>
      <span v-else>
        {{ value.lte }}
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GteLteRange',

  props: {
    value: {
      type: Object as PropType<{ gte: Money | string | number; lte: Money | string | number } | any>,
      default: () => undefined
    },
    type: {
      type: String as PropType<'date' | 'range' | 'money-range'>,
      default: 'range'
    }
  }
})
</script>
