<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column mx-6 my-4">
            <switch-field v-model="form.require_dob" class="ma-6" :label="$t('Require Customer Date of Birth')" />
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
import type {
  CustomerGeneralSettings,
  GeneralSettingsResponse
} from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsCustomer',
  components: { Scrollable, FormValidatorWrapper, SwitchField },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<CustomerGeneralSettings>({ require_dob: false, ...props.value.customer })

    const submit = (): void => emit('submit', { code: 'general.customer', payload: { ...form.value } })

    return {
      submit,
      form
    }
  }
})
</script>
