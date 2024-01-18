<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column ma-6 flex-gap-16">
            <general-setting-contact-address v-model="form" class="d-flex flex-column flex-gap-16" />
            <general-setting-contact-email v-model="form" />
            <general-setting-contact-telephone v-model="form" />
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingContactAddress from '@/components/domains/settings/general/contact/GeneralSettingContactAddress.vue'
import GeneralSettingContactEmail from '@/components/domains/settings/general/contact/GeneralSettingContactEmail.vue'
import GeneralSettingContactTelephone from '@/components/domains/settings/general/contact/GeneralSettingContactTelephone.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type {
  GeneralSettingsContact,
  GeneralSettingsResponse
} from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsContact',
  components: {
    Scrollable,
    FormValidatorWrapper,
    GeneralSettingContactTelephone,
    GeneralSettingContactEmail,
    GeneralSettingContactAddress
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const contactTemplate = () => ({
      address: {
        name: '',
        street: '',
        city: '',
        region: '',
        postcode: '',
        country_code: '',
        company_id: ''
      }
    })

    const form = ref<GeneralSettingsContact>({ ...contactTemplate(), ...props.value.contact })

    const submit = (): void => emit('submit', { code: 'general.contact', payload: form.value })

    return {
      submit,
      form
    }
  }
})
</script>
