<template>
  <v-text-field v-bind="$attrs" v-model="postcode" outlined :label="$t('Postcode')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { ShippoSettings } from '@/types/plugins/Shippo'

export default defineComponent({
  name: 'ShippoAddressPostcode',

  props: {
    value: {
      type: Object as PropType<ShippoSettings['optional_address']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const postcode = computed({
      get: () => props.value?.postcode || '',
      set: (postcode) => emit('input', { ...props.value, postcode })
    })

    return {
      postcode
    }
  }
})
</script>
