<template>
  <v-select
    v-bind="$attrs"
    v-model="price_type"
    item-text="text"
    item-value="value"
    :items="types"
    :label="$t('Price Type')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { ShippingPriceType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { DropdownOptions } from '@/types/DropdownOptions'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'SelectShippingPriceType',

  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const price_type = computed({
      get: () => props.value.price_type,
      set: (price_type) => emit('input', { ...props.value, price_type })
    })

    const types = computed((): DropdownOptions<ShippingPriceType>[] => [
      { text: t('Fixed'), value: ShippingPriceType.FIXED },
      { text: t('Per Item'), value: ShippingPriceType.PER_ITEM }
    ])

    return {
      price_type,
      types
    }
  }
})
</script>
