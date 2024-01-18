<template>
  <v-text-field
    v-bind="$attrs"
    v-model="max_customer_uses"
    outlined
    :label="$t('Maximum uses per customer')"
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionMaxCustomerUses',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const max_customer_uses = computed({
      get: () => props.value.max_customer_uses,
      set: (max_customer_uses) => emit('input', { ...props.value, max_customer_uses })
    })

    return {
      max_customer_uses
    }
  }
})
</script>
