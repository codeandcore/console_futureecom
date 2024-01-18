<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="pa-6">
            <image-url-input v-model="brandSetting" value-key="logo" />
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import type { BrandSettings, GeneralSettingsResponse } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsBrand',

  components: { Scrollable, FormValidatorWrapper, ImageUrlInput },

  props: {
    value: {
      type: Object as PropType<GeneralSettingsResponse>,
      required: true
    }
  },

  setup(props, { emit }) {
    const brandSetting = ref<BrandSettings>({ logo: null, ...props.value.brand })

    const submit = (): void => {
      emit('submit', { code: 'general.brand', payload: { logo: brandSetting.value.logo || null } })
    }

    return {
      submit,
      brandSetting
    }
  }
})
</script>
