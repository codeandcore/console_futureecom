<template>
  <v-text-field v-bind="$attrs" v-model="name" outlined :label="$t('Name')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressName',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const name = computed({
      get: () => props.value?.name || '',
      set: (name) => emit('input', { ...props.value, name })
    })

    return {
      name
    }
  }
})
</script>
