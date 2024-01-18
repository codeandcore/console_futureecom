<template>
  <v-text-field
    v-bind="$attrs"
    v-model="max_total_uses"
    outlined
    :label="$t('Maximum total uses')"
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionMaxTotalUses',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const max_total_uses = computed({
      get: () => props.value.max_total_uses,
      set: (max_total_uses) => emit('input', { ...props.value, max_total_uses })
    })

    return {
      max_total_uses
    }
  }
})
</script>
