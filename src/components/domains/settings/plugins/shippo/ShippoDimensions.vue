<template>
  <div>
    <div class="d-flex flex-gap-16">
      <shippo-dimensions-size-unit v-model="dimensions" :rules="rules.required" />
      <shippo-dimensions-weight-unit v-model="dimensions" :rules="rules.required" />
    </div>
    <shippo-should-convert v-model="dimensions" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import ShippoDimensionsSizeUnit from '@/components/domains/settings/plugins/shippo/dimensions/ShippoDimensionsSizeUnit.vue'
import ShippoDimensionsWeightUnit from '@/components/domains/settings/plugins/shippo/dimensions/ShippoDimensionsWeightUnit.vue'
import ShippoShouldConvert from '@/components/domains/settings/plugins/shippo/dimensions/ShippoDimensionsShouldConvert.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoDimensions',

  components: { ShippoShouldConvert, ShippoDimensionsWeightUnit, ShippoDimensionsSizeUnit },

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const dimensions = computed({
      get: () => props.value.dimensions,
      set: (dimensions) => emit('input', { ...props.value, dimensions })
    })

    const rules = {
      required: [(value: string) => useNotEmptyValidationRule(value)]
    }

    return {
      dimensions,
      rules
    }
  }
})
</script>
