<template>
  <region-field
    v-bind="$attrs"
    :key="value.country_code"
    v-model="region"
    :country-code="value.country_code"
    hide-details="auto"
    @update:has-regions="$emit('update:has-regions', $event)"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import RegionField from '@/components/common/RegionField.vue'
import type { AddressContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressRegion',

  components: { RegionField },

  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const region = computed({
      get: () => props.value.region,
      set: (region) => emit('input', { ...props.value, region })
    })

    return {
      region
    }
  }
})
</script>
