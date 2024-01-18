<template>
  <v-text-field
    v-bind="$attrs"
    v-model="dependent_locality"
    :label="$t('Dependent Locality')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryDependentLocality',

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const dependent_locality = computed({
      get: () => props.value.dependent_locality,
      set: (dependent_locality) => emit('input', { ...props.value, dependent_locality })
    })

    return {
      dependent_locality
    }
  }
})
</script>
