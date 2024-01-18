<template>
  <span data-cy="money-preview" :class="{ 'grey--text': !money }">
    {{ !!money ? withStoreCurrency(money) : $t('N/A') }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useMoney } from '@/composable/useMoney'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MoneyPreview',

  props: {
    value: {
      type: [] as PropType<Money | null | undefined>,
      default: undefined
    }
  },

  setup(props) {
    const { withStoreCurrency } = useMoney()

    const money = computed((): Money | null | undefined => {
      const amount = props.value ? parseInt(`${props.value.amount}`) : NaN
      return !Number.isNaN(amount) ? props.value : undefined
    })

    return {
      money,
      withStoreCurrency
    }
  }
})
</script>
