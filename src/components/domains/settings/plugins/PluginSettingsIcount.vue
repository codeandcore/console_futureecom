<template>
  <div>
    <switch-field v-model="form.enabled" :label="$t('Enabled')" />
    <switch-field v-model="form.send_email" :label="$t('Send Email to Customer')" />
    <switch-field v-model="form.ignore_pos_guest" :label="$t('Ignore PoS Guests')" />

    <v-text-field v-model="form.cid" :rules="rules.cid" outlined :label="$t('CID')" />
    <v-text-field v-model="form.user" :rules="rules.user" outlined :label="$t('User')" />
    <password-field v-model="form.pass" :rules="rules.pass" outlined :label="$t('Password')" class="align-start" />
    <v-select
      v-model="form.doc_lang"
      :label="$t('Document Language')"
      :items="documentLanguages"
      item-text="text"
      item-value="value"
      outlined
    />

    <v-divider />

    <switch-field v-model="form.send_sms" :label="$t('Send SMS to Customer')" />

    <v-slide-y-reverse-transition mode="out-in" group>
      <template v-if="form.send_sms">
        <v-text-field key="sms_prefix" v-model="form.sms_prefix" outlined :label="$t('SMS Prefix')" />
        <v-text-field key="sms_suffix" v-model="form.sms_suffix" outlined :label="$t('SMS Suffix')" />
      </template>
    </v-slide-y-reverse-transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import PasswordField from '@/components/common/PasswordField.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { IcountSettings } from '@/types/plugins/ICount'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'PluginSettingsIcount',
  components: { PasswordField, SwitchField },
  props: {
    value: {
      type: Object as PropType<IcountSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const settingsTemplate: IcountSettings = {
      enabled: false,
      cid: '',
      user: '',
      pass: '',
      send_email: false,
      ignore_pos_guest: false,
      send_sms: false,
      doc_lang: '',
      sms_suffix: null,
      sms_prefix: null
    }

    const form = ref<IcountSettings>({ ...settingsTemplate, ...props.value })

    const rules = {
      cid: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      user: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      pass: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    const documentLanguages = computed(() => [
      { text: t('English'), value: 'en' },
      { text: t('Hebrew'), value: 'he' }
    ])

    watch(form, () => emit('input', { ...form.value }), { deep: true })

    return {
      form,
      rules,
      documentLanguages
    }
  }
})
</script>
