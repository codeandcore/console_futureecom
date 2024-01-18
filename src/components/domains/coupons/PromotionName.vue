<template>
  <v-text-field v-bind="$attrs" v-model="name" outlined :label="$t('Discount name')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionName',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const name = computed({
      get: () => props.value.name,
      set: (name) => emit('input', { ...props.value, name })
    })

    return {
      name
    }
  }
})
</script>
