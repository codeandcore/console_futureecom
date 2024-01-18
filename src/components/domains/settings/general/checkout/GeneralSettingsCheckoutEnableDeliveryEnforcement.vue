<template>
  <switch-field
    v-bind="$attrs"
    v-model="enableDeliveryEnforcement"
    :label="$t('Delivery Interval')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsCheckoutEnableDeliveryEnforcement',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const enableDeliveryEnforcement = computed({
      get: () => props.value.enable_delivery_enforcement,
      set: (enable_delivery_enforcement) => emit('input', { ...props.value, enable_delivery_enforcement })
    })

    return {
      enableDeliveryEnforcement
    }
  }
})
</script>
