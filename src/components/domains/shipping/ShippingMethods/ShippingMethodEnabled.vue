<template>
  <switch-field v-bind="$attrs" v-model="enabled" :label="$t('Enabled')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodEnabled',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const enabled = computed({
      get: () => props.value.enabled,
      set: (enabled) => emit('input', { ...props.value, enabled })
    })

    return {
      enabled
    }
  }
})
</script>
