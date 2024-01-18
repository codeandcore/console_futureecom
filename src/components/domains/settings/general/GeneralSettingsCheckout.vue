<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="mt-4 mx-6 d-flex flex-column flex-gap-16">
            <general-setting-checkout-disabled-for-guest v-model="form" />
            <general-setting-checkout-purchase-order-allowed v-model="form" />
            <general-settings-checkout-requesting-delivery-allowed v-model="form" />

            <v-slide-y-reverse-transition mode="out-in">
              <div v-if="form.requesting_delivery_allowed" class="d-flex flex-column flex-gap-16">
                <general-settings-checkout-enable-delivery-enforcement v-model="form" />
                <general-setting-checkout-show-delivery-time v-model="form" />
              </div>
            </v-slide-y-reverse-transition>
          </div>

          <v-slide-y-reverse-transition mode="out-in">
            <div v-if="form.requesting_delivery_allowed">
              <v-divider class="my-4" />

              <general-setting-delivery-interval v-model="form" class="mx-6" />
              <v-divider class="my-4" />

              <div class="d-flex flex-column mx-6">
                <h2>
                  {{ $t('Blackouts') }}
                </h2>
                <span class="text-caption">
                  {{ $t('general.settings.checkout.blackouts') }}
                </span>

                <general-setting-delivery-blackouts v-model="form" class="my-8" />
              </div>
            </div>
          </v-slide-y-reverse-transition>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingCheckoutDisabledForGuest from '@/components/domains/settings/general/checkout/GeneralSettingsCheckoutDisableForGuest.vue'
import GeneralSettingCheckoutPurchaseOrderAllowed from '@/components/domains/settings/general/checkout/GeneralSettingsCheckoutPurchaseOrderAllowed.vue'
import GeneralSettingCheckoutShowDeliveryTime from '@/components/domains/settings/general/checkout/GeneralSettingsCheckoutShowDeliveryTime.vue'
import GeneralSettingDeliveryBlackouts from '@/components/domains/settings/general/checkout/GeneralSettingsDeliveryBlackouts.vue'
import GeneralSettingDeliveryInterval from '@/components/domains/settings/general/checkout/GeneralSettingDeliveryInterval.vue'
import GeneralSettingsCheckoutEnableDeliveryEnforcement from '@/components/domains/settings/general/checkout/GeneralSettingsCheckoutEnableRequestedDelivery.vue'
import GeneralSettingsCheckoutRequestingDeliveryAllowed from '@/components/domains/settings/general/checkout/GeneralSettingsCheckoutRequestingDeliveryAllowed.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { CheckoutSettings, GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsCheckout',
  components: {
    GeneralSettingCheckoutDisabledForGuest,
    Scrollable,
    FormValidatorWrapper,
    GeneralSettingDeliveryBlackouts,
    GeneralSettingDeliveryInterval,
    GeneralSettingCheckoutShowDeliveryTime,
    GeneralSettingsCheckoutEnableDeliveryEnforcement,
    GeneralSettingsCheckoutRequestingDeliveryAllowed,
    GeneralSettingCheckoutPurchaseOrderAllowed
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<CheckoutSettings>({ ...props.value.checkout })

    const submit = (): void => emit('submit', { code: 'general.checkout', payload: form.value })

    return {
      submit,
      form
    }
  }
})
</script>
