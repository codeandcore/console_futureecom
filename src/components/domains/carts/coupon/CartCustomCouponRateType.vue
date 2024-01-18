<template>
  <v-select
    v-bind="$attrs"
    v-model="rate_type"
    outlined
    :items="items"
    :label="$t('Rate type')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { OrderableCustomDiscount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCustomCouponRateType',

  props: {
    value: {
      type: Object as PropType<OrderableCustomDiscount>,
      default: undefined
    },
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const rate_type = computed({
      get: () => props.value.rate_type,
      set: (rate_type) => emit('input', {
        ...props.value,
        rate_type,
        value: 0
      })
    })

    const items = computed(() => ([
      { text: t('Distributed'), value: 'distributed' },
      { text: t('Percentage'), value: 'percentage' },
    ]))

    return {
      items,
      rate_type,
    }
  }
})
</script>
