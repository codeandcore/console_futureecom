<template>
  <region-field
    v-bind="$attrs"
    :key="value.country_code"
    v-model="region"
    :country-code="value.country_code"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import RegionField from '@/components/common/RegionField.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressRegion',
  components: { RegionField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const region = computed({
      get: () => props.value?.region,
      set: (region) => emit('input', { ...props.value, region })
    })

    return {
      region
    }
  }
})
</script>
