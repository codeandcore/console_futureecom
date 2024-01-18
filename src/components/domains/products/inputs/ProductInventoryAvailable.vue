<template>
  <switch-field v-model="is_available" :label="$t('Is available')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryAvailable',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const is_available = computed({
      get: () => (props.value.inventory ? props.value.inventory.is_available : undefined),
      set: (is_available) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, is_available }
        })
    })

    return {
      is_available
    }
  }
})
</script>
