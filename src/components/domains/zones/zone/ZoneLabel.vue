<template>
  <v-text-field v-bind="$attrs" v-model="label" :label="$t('Label')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Zone } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'ZoneLabel',

  props: {
    value: {
      type: Object as PropType<Zone>,
      required: true
    }
  },
  setup(props, { emit }) {
    const label = computed({
      get: () => props.value.label,
      set: (label) => emit('input', { ...props.value, label })
    })

    return {
      label
    }
  }
})
</script>
