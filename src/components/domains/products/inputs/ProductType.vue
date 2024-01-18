<template>
  <v-select v-model="type" :items="types" :label="$t('Product type')" outlined />
</template>

<script lang="ts">
import { ProductType } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { computed, defineComponent } from '@vue/composition-api'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductType',
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props, { emit }) {
    const types: ProductType[] = [ProductType.VIRTUAL, ProductType.PHYSICAL, ProductType.DIGITAL]

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type })
    })

    return {
      type,
      types
    }
  }
})
</script>
