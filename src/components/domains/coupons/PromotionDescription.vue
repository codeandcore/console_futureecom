<template>
  <v-text-field
    v-bind="$attrs"
    v-model="description"
    outlined
    :label="$t('Discount description')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionDescription',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const description = computed({
      get: () => props.value.description,
      set: (description) => emit('input', { ...props.value, description })
    })

    return {
      description
    }
  }
})
</script>
