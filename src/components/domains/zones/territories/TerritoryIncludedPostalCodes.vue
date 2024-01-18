<template>
  <v-text-field
    v-bind="$attrs"
    v-model="included_postal_codes"
    :label="$t('Included postal codes')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Territory } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'TerritoryIncludedPostalCodes',

  props: {
    value: {
      type: Object as PropType<Territory>,
      required: true
    }
  },
  setup(props, { emit }) {
    const included_postal_codes = computed({
      get: () => props.value.included_postal_codes,
      set: (included_postal_codes) => emit('input', { ...props.value, included_postal_codes })
    })

    return {
      included_postal_codes
    }
  }
})
</script>
