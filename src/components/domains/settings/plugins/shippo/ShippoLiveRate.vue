<template>
  <switch-field v-bind="$attrs" v-model="liveRates" :label="$t('Use Rates at Checkout')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoLiveRate',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const liveRates = computed({
      get: () => props.value.live_rates,
      set: (live_rates) => emit('input', { ...props.value, live_rates })
    })

    return {
      liveRates
    }
  }
})
</script>
