<template>
  <switch-field v-bind="$attrs" v-model="active" :label="$t('Active')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Box } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BoxActive',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const active = computed({
      get: () => props.value.active,
      set: (active) => emit('input', { ...props.value, active })
    })

    return {
      active
    }
  }
})
</script>
