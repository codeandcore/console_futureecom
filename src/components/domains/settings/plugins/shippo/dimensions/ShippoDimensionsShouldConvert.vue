<template>
  <switch-field v-model="shouldConvert" :label="$t('Should convert')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoShouldConvert',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<ShippoSettings['dimensions']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const shouldConvert = computed({
      get: () => props.value.should_convert,
      set: (should_convert) => emit('input', { ...props.value, should_convert })
    })

    return {
      shouldConvert
    }
  }
})
</script>
