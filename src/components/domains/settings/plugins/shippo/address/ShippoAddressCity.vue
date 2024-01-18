<template>
  <v-text-field v-bind="$attrs" v-model="city" outlined :label="$t('City')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressCity',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const city = computed({
      get: () => props.value?.city,
      set: (city) => emit('input', { ...props.value, city })
    })

    return {
      city
    }
  }
})
</script>
