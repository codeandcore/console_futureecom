<template>
  <v-select
    v-bind="$attrs"
    v-model="target"
    outlined
    :items="items"
    :label="$t('Target')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { OrderableCustomDiscount } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCustomCouponTarget',

  props: {
    value: {
      type: Object as PropType<OrderableCustomDiscount>,
      default: undefined
    },
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const target = computed({
      get: () => props.value.target,
      set: (target) => emit('input', {
        ...props.value,
        target,
      })
    })

    const items = computed(() => ([
      { text: t('Items'), value: 'items' },
      { text: t('Shipping'), value: 'shipping' },
    ]))

    return {
      items,
      target,
    }
  }
})
</script>
