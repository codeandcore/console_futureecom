<template>
  <div>
    <general-setting-delivery-blackouts-dates v-model="deliveryBlackouts" />
    <general-setting-delivery-blackouts-weekdays v-model="deliveryBlackouts" />
    <general-setting-delivery-blackouts-hours v-model="deliveryBlackouts" class="d-flex flex-column flex-gap-16" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import GeneralSettingDeliveryBlackoutsDates from '@/components/domains/settings/general/checkout/DeliveryBlackouts/GeneralSettingDeliveryBlackoutsDates.vue'
import GeneralSettingDeliveryBlackoutsHours from '@/components/domains/settings/general/checkout/DeliveryBlackouts/GeneralSettingDeliveryBlackoutsHours.vue'
import GeneralSettingDeliveryBlackoutsWeekdays from '@/components/domains/settings/general/checkout/DeliveryBlackouts/GeneralSettingDeliveryBlackoutsWeekdays.vue'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingDeliveryBlackouts',

  components: {
    GeneralSettingDeliveryBlackoutsHours,
    GeneralSettingDeliveryBlackoutsWeekdays,
    GeneralSettingDeliveryBlackoutsDates
  },

  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const deliveryBlackouts = computed({
      get: () => props.value.delivery_blackouts,
      set: (delivery_blackouts) => emit('input', { ...props.value, delivery_blackouts })
    })

    return {
      deliveryBlackouts
    }
  }
})
</script>
