<template>
  <form-validator-wrapper>
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="my-15 text-h3 text--disabled text-center">
            {{ $t('Incoming feature') }}
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'

export default defineComponent({
  name: 'SettingsWorkflow',

  components: { Scrollable, FormValidatorWrapper }
})
</script>
