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
            <general-settings-quote-enabled v-model="form" />
            <general-settings-quote-allowed-customer-groups v-model="form" />
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingsQuoteAllowedCustomerGroups from '@/components/domains/settings/general/quote/GeneralSettingsQuoteAllowedCustomerGroups.vue'
import GeneralSettingsQuoteEnabled from '@/components/domains/settings/general/quote/GeneralSettingsQuoteEnabled.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { GeneralSettingsResponse, QuoteSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsCheckout',
  components: {
    GeneralSettingsQuoteEnabled,
    GeneralSettingsQuoteAllowedCustomerGroups,
    Scrollable,
    FormValidatorWrapper
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<QuoteSettings>({ ...{ enabled: true, allowed_customer_groups: null }, ...props.value.quote })

    const submit = (): void => emit('submit', { code: 'general.quote', payload: form.value })

    return {
      submit,
      form
    }
  }
})
</script>
