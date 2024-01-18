<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <template #activator="{ on, attrs }">
      <slot name="default" :on="on" :attrs="attrs" :is-open="showDialog" />
    </template>

    <form-validator-wrapper @submit="importHandler">
      <template #default="{ valid }">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Import template(s)') }}</span>
            <v-icon size="32" @click="showDialog = false">close</v-icon>
          </v-card-title>

          <v-divider />

          <v-card-text :key="showDialog">
            <cms-import-inputs v-model="data" class="d-flex flex-column flex-gap-16" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="d-flex justify-end pa-4">
            <v-btn color="primary" :loading="loading" :disabled="!valid || loading" depressed type="submit">
              {{ $t('Import') }}
              <span v-if="!data.parts.length">({{ $t('all') }})</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import CmsImportInputs from '@/components/domains/cms/dialogs/import/CmsImportInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import useApi from '@/composable/useApi'
import type { CmsImportData } from '@/types/Cms'

export default defineComponent({
  name: 'TemplateImportDialog',

  components: { CmsImportInputs, FormValidatorWrapper },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)
    const showDialog = ref(false)

    const dataTemplate = (): CmsImportData => ({ file: null, parts: [], overwrite: true })
    const data = ref<CmsImportData>(dataTemplate())

    watch(showDialog, () => (data.value = dataTemplate()))

    const importHandler = (): void => {
      loading.value = true

      const formData = new FormData()
      const dataParts = data.value.parts.length ? data.value.parts : ['base']

      formData.append('overwrite', String(Number(data.value.overwrite)))

      if (data.value.file) {
        formData.append('template', data.value.file)
      }

      dataParts.forEach((part): void => formData.append('parts[]', part))

      api.cms
        .importTemplate(formData)
        .then(() => {
          showDialog.value = false
          addSuccessToast(t('Template imported'))
          emit('onSuccess')
        })
        .catch(() => addErrorToast(t('Unable to import template')))
        .finally(() => (loading.value = false))
    }

    return {
      showDialog,
      importHandler,
      loading,
      data
    }
  }
})
</script>
