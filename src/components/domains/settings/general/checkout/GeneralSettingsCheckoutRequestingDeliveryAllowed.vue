<template>
  <div>
    <switch-field v-bind="$attrs" v-model="requestingDeliveryAllowed" :label="$t('Enable Requested Delivery')" />
    <span class="text-caption">
      {{ $t('general.settings.checkout.requesting_delivery') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsCheckoutRequestingDeliveryAllowed',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const requestingDeliveryAllowed = computed({
      get: () => props.value.requesting_delivery_allowed,
      set: (requesting_delivery_allowed) => emit('input', { ...props.value, requesting_delivery_allowed })
    })

    return {
      requestingDeliveryAllowed
    }
  }
})
</script>
