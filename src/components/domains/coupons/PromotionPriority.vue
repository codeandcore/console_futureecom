<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="priority"
    :label="$t('Discount Priority')"
    outlined
    type="number"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionPriority',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const priority = computed({
      get: () => props.value.priority,
      set: (priority) => emit('input', { ...props.value, priority })
    })

    return {
      priority
    }
  }
})
</script>
