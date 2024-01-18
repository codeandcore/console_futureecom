<template>
  <switch-field v-bind="$attrs" v-model="purchaseOrderAllowed" :label="$t('Purchase Order Allowed')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingCheckoutPurchaseOrderAllowed',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const purchaseOrderAllowed = computed({
      get: () => props.value.purchase_order_allowed,
      set: (purchase_order_allowed) => emit('input', { ...props.value, purchase_order_allowed })
    })

    return {
      purchaseOrderAllowed
    }
  }
})
</script>
