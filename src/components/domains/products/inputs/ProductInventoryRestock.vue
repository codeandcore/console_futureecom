<template>
  <switch-field v-model="is_restockable" :label="$t('Restockable Item')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryRestock',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const is_restockable = computed({
      get: () => (props.value.inventory ? props.value.inventory.is_restockable : undefined),
      set: (is_restockable) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, is_restockable }
        })
    })

    return {
      is_restockable
    }
  }
})
</script>
