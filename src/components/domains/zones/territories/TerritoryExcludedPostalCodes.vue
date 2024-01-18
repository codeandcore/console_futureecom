<template>
  <v-text-field
    v-bind="$attrs"
    v-model="excluded_postal_codes"
    :label="$t('Excluded postal codes')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryExcludedPostalCodes',

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const excluded_postal_codes = computed({
      get: () => props.value.excluded_postal_codes,
      set: (excluded_postal_codes) => emit('input', { ...props.value, excluded_postal_codes })
    })

    return {
      excluded_postal_codes
    }
  }
})
</script>
