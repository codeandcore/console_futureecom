<template>
  <div>
    <div class="d-flex flex-row-reverse">
      <v-btn color="primary" :loading="loading" small text depressed @click="testConnection">
        {{ $t('Test connection') }}
      </v-btn>
    </div>
    <switch-field v-model="form.enabled" :label="$t('Enabled')" />
    <switch-field v-model="form.enabled_order_reporting" :label="$t('Enabled Order Reporting')" />
    <switch-field v-model="form.log_enabled" :label="$t('Enabled show logs')" />

    <v-divider class="my-4" />

    <v-text-field v-model="form.account_id" :rules="rules.account_id" outlined :label="$t('Account ID')" />
    <v-text-field v-model="form.license_key" :rules="rules.license_key" outlined :label="$t('License Key')" />
    <v-divider class="my-4" />
    <v-text-field v-model="form.machine_name" outlined :label="$t('Machine Name')" />
    <v-text-field v-model="form.service_url" :rules="rules.service_url" outlined :label="$t('Service URL')" />
    <v-text-field v-model="form.company_code" :rules="rules.company_code" outlined :label="$t('Company Code')" />
    <avalara-connection-modal v-if="info" :info="info" :show="showInfo" @close="showInfo = false" />
  </div>
</template>

<script lang="ts">
import { dataLoader } from '@/composable/loaders/dataLoader'
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useToasts } from '@/composable/useToasts'
import AvalaraConnectionModal from '@/components/domains/settings/modal/AvalaraConnectionModal.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import useApi from '@/composable/useApi'
import type { AvalaraSettings } from '@/types/plugins/Avalara'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'PluginSettingsAvalara',
  components: { SwitchField, AvalaraConnectionModal },
  props: {
    value: {
      type: Object as PropType<AvalaraSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const settingsTemplate: AvalaraSettings = {
      enabled: false,
      enabled_order_reporting: false,
      machine_name: '',
      service_url: '',
      company_code: '',
      account_id: null,
      license_key: null,
      log_enabled: false
    }

    const showInfo = ref(false)
    const testLoader = dataLoader()
    const form = ref<AvalaraSettings>({ ...settingsTemplate, ...props.value })
    delete form.value.username
    delete form.value.password

    const rules = {
      account_id: [
        (val: string): ValidationRule => useNotEmptyValidationRule(val),
        (val: string): ValidationRule => (/^[0-9]+$/.test(val) ? true : t('Account ID must be a number only'))
      ],
      license_key: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      application_name: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      service_url: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      username: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      password: [(val: string): ValidationRule => useNotEmptyValidationRule(val)],
      company_code: [(val: string): ValidationRule => useNotEmptyValidationRule(val)]
    }

    watch(form, () => emit('input', { ...form.value }), { deep: true })
    testLoader.onSuccess(() => (showInfo.value = true))

    testLoader.onError(() => {
      if (testLoader.errors.value.message) {
        addErrorToast(t(testLoader.errors.value.message))
        return
      }
      if (!testLoader.errors.value.request.response) {
        return
      }
      const { status, message } = testLoader.errors.value.request.response
      addErrorToast(t(status && message ? `Status: ${status}. ${message}` : 'Connection error'))
    })

    const testConnection = (): void => {
      testLoader.loadData(() => useApi().taxes.testAvalaraConnection())
    }

    return {
      form,
      rules,
      testConnection,
      info: testLoader.data,
      showInfo,
      loading: testLoader.loading
    }
  }
})
</script>
