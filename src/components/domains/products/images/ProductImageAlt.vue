<template>
  <v-textarea v-bind="$attrs" v-model="alt" :label="$t('Alt')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { ProductImage } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductImageAlt',

  props: {
    value: {
      type: Object as PropType<ProductImage>,
      required: true
    }
  },

  setup(props, { emit }) {
    const alt = computed({
      get: () => props.value.alt,
      set: (alt) => emit('input', { ...props.value, alt })
    })

    return {
      alt
    }
  }
})
</script>
