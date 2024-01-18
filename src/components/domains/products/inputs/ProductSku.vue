<template>
  <v-text-field v-model="sku" :label="$t('SKU')" outlined v-bind="$attrs" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductSku',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const sku = computed({
      get: () => props.value.sku,
      set: (sku) => emit('input', { ...props.value, sku })
    })

    return {
      sku
    }
  }
})
</script>
