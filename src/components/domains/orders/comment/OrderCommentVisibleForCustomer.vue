<template>
  <switch-field v-bind="$attrs" v-model="visible_for_customer" :label="$t('Should be visible for customer?')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { BaseOrderComment } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderCommentVisibleForCustomer',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<BaseOrderComment>,
      required: true
    }
  },

  setup(props, { emit }) {
    const visible_for_customer = computed({
      get: () => props.value.visible_for_customer || false,
      set: (visible_for_customer: boolean) => emit('input', { ...props.value, visible_for_customer })
    })

    return {
      visible_for_customer
    }
  }
})
</script>
