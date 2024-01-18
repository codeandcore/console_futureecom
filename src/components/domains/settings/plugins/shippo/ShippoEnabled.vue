<template>
  <switch-field v-bind="$attrs" v-model="enabled" :label="$t('Enabled')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoApiKey',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
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
