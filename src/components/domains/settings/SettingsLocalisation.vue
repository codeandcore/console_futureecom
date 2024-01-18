<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column mx-6 text-caption flex-gap-16 mt-6">
            <settings-localisation-regions v-model="form" class="d-flex flex-column text-caption flex flex-gap-8" />
            <v-divider class="my-4" />
            <settings-localisation-countries v-model="form" class="d-flex flex-column text-caption flex flex-gap-8" />
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
import SettingsLocalisationCountries from '@/components/domains/settings/localisations/SettingsLocalisationCountries.vue'
import SettingsLocalisationRegions from '@/components/domains/settings/localisations/SettingsLocalisationRegions.vue'
import type { LocalisationSettings, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingsLocalisation',

  components: { SettingsLocalisationCountries, SettingsLocalisationRegions, Scrollable, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<LocalisationSettings>(structuredClone(props.value.localisation))

    const submit = (): void => emit('submit', { code: 'localisation', payload: form.value })

    return {
      form,
      submit
    }
  }
})
</script>
