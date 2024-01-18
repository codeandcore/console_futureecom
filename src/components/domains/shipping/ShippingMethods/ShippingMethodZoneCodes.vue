<template>
  <div>
    <span>{{ $t('Zones') }}:</span>
    <select-multiple-zone
      v-model="currentZones"
      class="d-flex flex-column flex-gap-16"
      :options="{ showChip: true, grid: gridOptions }"
      @input="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import SelectMultipleZone from '@/components/common/selectables/SelectMultipleZones.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ShippingMethodZoneCodes',

  components: { SelectMultipleZone },

  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const currentZones = ref<Zone[]>()

    if (props.value.zone_codes?.length) {
      api.zones.zones({ filter: { code: props.value.zone_codes } }).then((val) => (currentZones.value = val.data))
    }

    const zone_codes = computed({
      get: () => props.value.zone_codes,
      set: (zone_codes) => emit('input', { ...props.value, zone_codes })
    })

    const gridOptions = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Name'), value: 'label' },
        { text: ctx.$t('Code'), value: 'code' }
      ]

      return {
        headers
      }
    })

    const onSelect = (val: Zone[]) => {
      currentZones.value = val
      zone_codes.value = val.map((item) => item.code)
    }

    return {
      onSelect,
      currentZones,
      gridOptions
    }
  }
})
</script>
