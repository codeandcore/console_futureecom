<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex ma-6 flex-column flex-gap-16">
            <switch-field v-model="form.can_pay_on_hold" :label="$t('Can pay on hold')" />
            <v-text-field
              v-model.number="form.requested_delivery_window"
              :disabled="!deliveryWindowEnabled"
              outlined
              label="Delivery Shipping Window"
              hide-details="auto"
              type="number"
            />
            <span v-if="deliveryWindowEnabled" class="text-caption my-4">
              {{ $t('general.settings.checkout.delivery_window') }}
            </span>
            <span v-else class="text-caption my-4">
              {{ $t('To specify oder delivery window, you must') }}
              <router-link :to="{ name: 'settings-general', params: { option: 'checkout' } }">
                {{ $t('turn on Requested Delivery and Delivery Enforcement') }}
              </router-link>
            </span>
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { OrderSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsOrder',
  components: { Scrollable, FormValidatorWrapper, SwitchField },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const deliveryWindowEnabled: boolean =
      !!props.value.checkout?.requesting_delivery_allowed && !!props.value.checkout?.enable_delivery_enforcement

    const form = ref<OrderSettings>({
      can_pay_on_hold: false,
      requested_delivery_window: null,
      ...props.value.order
    })

    const submit = (): void => emit('submit', { code: 'general.order', payload: { ...form.value } })

    return {
      submit,
      deliveryWindowEnabled,
      form
    }
  }
})
</script>
