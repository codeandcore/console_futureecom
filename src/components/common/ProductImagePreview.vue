<template>
  <v-img
    v-bind="$attrs"
    ::key="currentPlaceholder"
    :src="currentPlaceholder"
    :max-height="dimension"
    :max-width="maxWidth"
    @error="nextPlaceholder"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useProductPlaceholder } from '@/composable/useProductPlaceholder'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductImagePreview',

  props: {
    value: {
      type: [] as PropType<string | null>,
      default: ''
    },
    size: {
      type: String as PropType<'x-small' | 'small' | 'medium' | 'large' | 'x-large'>,
      default: 'medium'
    },
    maxWidth: {
      type: [] as PropType<string | number | undefined>,
      default: undefined
    }
  },

  setup(props) {
    const { currentPlaceholder, nextPlaceholder } = useProductPlaceholder(props.value || '')

    const dimensions: Record<'x-small' | 'small' | 'medium' | 'large' | 'x-large', string> = {
      'x-small': '25',
      'small': '50',
      'medium': '75',
      'large': '100',
      'x-large': '200'
    }

    const dimension = computed((): string => (props.maxWidth ? String(props.maxWidth) : dimensions[props.size]))

    return {
      dimension,
      currentPlaceholder,
      nextPlaceholder
    }
  }
})
</script>
