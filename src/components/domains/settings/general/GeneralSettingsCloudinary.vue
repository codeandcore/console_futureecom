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
            <general-setting-cloudinary-name v-model="form" :rules="rules.name" />
            <general-setting-cloudinary-preset v-model="form" :rules="rules.preset" />
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import GeneralSettingCloudinaryName from '@/components/domains/settings/general/cloudinary/GeneralSettingCloudinaryName.vue'
import GeneralSettingCloudinaryPreset from '@/components/domains/settings/general/cloudinary/GeneralSettingCloudinaryPreset.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import type { GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'GeneralSettingsCloudinary',

  components: {
    Scrollable,
    FormValidatorWrapper,
    GeneralSettingCloudinaryPreset,
    GeneralSettingCloudinaryName,
    ScrollableWrapper
  },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<GeneralSettingsResponse['cloudinary']>(structuredClone(props.value.cloudinary))

    const rules = {
      name: [(name: string): ValidationRule => useNotEmptyValidationRule(name)],
      preset: [(preset: string): ValidationRule => useNotEmptyValidationRule(preset)]
    }

    const submit = (): void => emit('submit', { code: 'general.cloudinary', payload: { ...form.value } })

    return {
      submit,
      form,
      rules
    }
  }
})
</script>
