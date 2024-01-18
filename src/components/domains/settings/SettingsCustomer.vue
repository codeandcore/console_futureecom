<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column flex-gap-32 ma-4">
            <h2>{{ $t('Guests') }}</h2>
            <setting-customers-guest v-model="form" />
            <v-divider />
            <h2>{{ $t('Customers') }}</h2>
            <setting-customers-customer v-model="form" />
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
import SettingCustomersCustomer from '@/components/domains/settings/customers/SettingCustomersCustomer.vue'
import SettingCustomersGuest from '@/components/domains/settings/customers/SettingCustomersGuest.vue'
import type { PropType } from '@vue/composition-api'
import type { Settings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'SettingsCustomer',

  components: { SettingCustomersCustomer, SettingCustomersGuest, Scrollable, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const template = (): Required<Settings['customers']> => ({
      guest: { default_group: '' },
      customer: { default_group: '', registration_disabled: true }
    })

    const form = ref({ ...template(), ...props.value.customers })

    const submit = (): void => emit('submit', { code: 'customers', payload: form.value })

    return {
      submit,
      form
    }
  }
})
</script>
