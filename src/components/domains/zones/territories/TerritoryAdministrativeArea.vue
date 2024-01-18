<template>
  <region-field
    v-bind="$attrs"
    :key="value.country_code"
    v-model="administrative_area"
    :country-code="value.country_code"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import RegionField from '@/components/common/RegionField.vue'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryAdministrativeArea',
  components: { RegionField },
  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const administrative_area = computed({
      get: () => props.value.administrative_area,
      set: (administrative_area) => emit('input', { ...props.value, administrative_area })
    })

    return {
      administrative_area
    }
  }
})
</script>
