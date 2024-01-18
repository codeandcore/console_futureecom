<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <template #activator="{ on, attrs }">
      <slot name="default" :on="on" :attrs="attrs" />
    </template>

    <form-validator-wrapper @submit="exportHandler">
      <template #default="{ valid }">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <div class="d-flex flex-column">
              <span>{{ $t('Export template') }}: {{ value.name }}</span>
              <span class="text-caption grey--text">{{ value.code }}</span>
            </div>
            <v-icon size="32" @click="showDialog = false">close</v-icon>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <select-multiple-cms-parts v-model="parts" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="d-flex justify-end pa-4">
            <v-btn color="primary" :loading="loading" :disabled="!valid || loading" depressed type="submit">
              {{ $t('Export') }}
              <span v-if="!parts.length">({{ $t('all') }})</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { createLink } from '@/libs/createLink'
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import SelectMultipleCmsParts from '@/components/common/selectables/SelectMultipleCmsParts.vue'
import useApi from '@/composable/useApi'
import type { CmsParts } from '@/types/Cms'
import type { PropType } from '@vue/composition-api'
import type { Template } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'TemplateExportDialog',

  components: { SelectMultipleCmsParts, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<Template>,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)
    const showDialog = ref(false)

    const parts = ref<CmsParts[]>([])

    const exportHandler = (): void => {
      loading.value = true

      api.cms
        .exportTemplate(props.value.code, { parts: parts.value.length ? parts.value : ['base'] })
        .then((val) => {
          const fileData = [JSON.stringify(val)]
          const fileName = `${props.value.code}_template.json`
          createLink(fileData, fileName).click()
        })
        .catch(() => addErrorToast(t('Unable to export template')))
        .finally(() => (loading.value = false))
    }

    return {
      showDialog,
      parts,
      exportHandler,
      loading
    }
  }
})
</script>
