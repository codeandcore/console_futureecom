<template>
  <v-text-field v-bind="$attrs" v-model="apiKey" outlined :label="$t('API Key')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoEnabled',

  props: {
    value: {
      type: Object as PropType<ShippoSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const apiKey = computed({
      get: () => props.value.api_key,
      set: (api_key) => emit('input', { ...props.value, api_key })
    })

    return {
      apiKey
    }
  }
})
</script>
