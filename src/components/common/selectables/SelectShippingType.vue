<template>
  <v-select
    v-bind="$attrs"
    v-model="type"
    :items="types"
    :label="$t('Type')"
    outlined
    item-text="text"
    item-value="value"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { ShippingType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { DropdownOptions } from '@/types/DropdownOptions'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'SelectShippingType',

  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type })
    })

    const types = computed((): DropdownOptions<ShippingType>[] => [
      { text: t('Delivery'), value: ShippingType.DELIVERY },
      { text: t('Pick up'), value: ShippingType.PICKUP }
    ])

    return {
      type,
      types
    }
  }
})
</script>
