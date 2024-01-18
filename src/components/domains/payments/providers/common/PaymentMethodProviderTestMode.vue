<template>
  <switch-field v-bind="$attrs" v-model="testMode" :label="$t('Test mode')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentMethodProviderTestMode',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<{ testMode?: boolean }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const testMode = computed({
      get: () => props.value.testMode,
      set: (testMode) => emit('input', { ...props.value, testMode })
    })

    return {
      testMode
    }
  }
})
</script>
