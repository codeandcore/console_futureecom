<template>
  <v-text-field v-bind="$attrs" v-model="code" outlined :label="$t('Coupon Code')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionCode',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const code = computed({
      get: () => props.value.code,
      set: (code) => emit('input', { ...props.value, code })
    })

    return {
      code
    }
  }
})
</script>
