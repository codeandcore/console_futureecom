<template>
  <switch-field v-model="track" :label="$t('Track inventory')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryTrack',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const track = computed({
      get: () => (props.value.inventory ? props.value.inventory.track : undefined),
      set: (track) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, track }
        })
    })

    return {
      track
    }
  }
})
</script>
