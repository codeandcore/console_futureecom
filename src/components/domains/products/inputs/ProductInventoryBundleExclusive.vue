<template>
  <switch-field v-model="is_bundle_exclusive" :label="$t('Bundle exclusive')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductInventoryBundleExclusive',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const is_bundle_exclusive = computed({
      get: () => (props.value.inventory ? props.value.inventory.is_bundle_exclusive : undefined),
      set: (is_bundle_exclusive) =>
        emit('input', {
          ...props.value,
          inventory: { ...props.value.inventory, is_bundle_exclusive }
        })
    })

    return {
      is_bundle_exclusive
    }
  }
})
</script>
