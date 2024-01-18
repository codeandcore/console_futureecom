<template>
  <switch-field
    v-bind="$attrs"
    v-model="commentVisibleForCustomer"
    hide-details="auto"
    outlined
    :label="$t('Show shipment comment to the customer')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { OrderShipmentData } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderShipmentCommentVisibleForCustomer',
  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<OrderShipmentData>,
      required: true
    }
  },

  setup(props, { emit }) {
    const commentVisibleForCustomer = computed({
      get: () => props.value.comment_visible_for_customer,
      set: (comment_visible_for_customer) => emit('input', { ...props.value, comment_visible_for_customer })
    })

    return {
      commentVisibleForCustomer
    }
  }
})
</script>
