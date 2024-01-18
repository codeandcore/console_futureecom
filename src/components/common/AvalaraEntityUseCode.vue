<template>
  <v-text-field
    v-model="avalaraEntityUseCode"
    v-bind="$attrs"
    :label="$t('Avalara Entity Use Code')"
    hide-details="auto"
    outlined
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AvalaraEntityUseCode',

  props: {
    value: {
      type: Object as PropType<{ [key: string]: unknown; avalara_entity_use_code?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const avalaraEntityUseCode = computed({
      get: () => props.value.avalara_entity_use_code,
      set: (avalara_entity_use_code) => emit('input', { ...props.value, avalara_entity_use_code })
    })

    return {
      avalaraEntityUseCode
    }
  }
})
</script>
