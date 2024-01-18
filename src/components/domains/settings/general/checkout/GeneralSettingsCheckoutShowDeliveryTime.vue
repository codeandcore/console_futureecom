<template>
  <switch-field v-bind="$attrs" v-model="showDeliveryTime" :label="$t('Show Delivery Time')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingCheckoutShowDeliveryTime',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const showDeliveryTime = computed({
      get: () => props.value.show_delivery_time,
      set: (show_delivery_time) => emit('input', { ...props.value, show_delivery_time })
    })

    return {
      showDeliveryTime
    }
  }
})
</script>
