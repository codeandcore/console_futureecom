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
            <switch-field v-model="form.terms_of_service.require" :label="$t('Required Terms of Service')" />
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
import type { PropType } from '@vue/composition-api'
import type { Settings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'SettingsAuth',

  components: { Scrollable, FormValidatorWrapper, SwitchField },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref<Settings['auth']>(props.value.auth)

    const submit = (): void => emit('submit', { code: 'auth', payload: { ...form.value } })

    return {
      submit,
      form
    }
  }
})
</script>
