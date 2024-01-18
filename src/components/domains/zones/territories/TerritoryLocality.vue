<template>
  <v-text-field v-bind="$attrs" v-model="locality" :label="$t('Locality')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryLocality',

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const locality = computed({
      get: () => props.value.locality,
      set: (locality) => emit('input', { ...props.value, locality })
    })

    return {
      locality
    }
  }
})
</script>
