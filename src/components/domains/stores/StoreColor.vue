<template>
  <div class="d-flex flex-column flex-gap-16">
    <span class="grey--text text--darken-2">{{ $t('Color') }}</span>
    <v-color-picker v-bind="$attrs" v-model="color" hide-inputs />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'StoreColor',

  props: {
    value: {
      type: Object as PropType<Store>,
      required: true
    }
  },

  setup(props, { emit }) {
    const color = computed({
      get: () => props.value.color || '#FF0000',
      set: (color) => emit('input', { ...props.value, color })
    })

    return {
      color
    }
  }
})
</script>
