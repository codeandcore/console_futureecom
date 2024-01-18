<template>
  <v-dialog v-model="dialogVisible" max-width="600">
    <template #activator="{ on }">
      <v-btn v-bind="$attrs" color="primary" depressed @click="dialogVisible = true" v-on="on">
        {{ $t('Import') }}
        <v-icon small class="ms-2">cloud_upload</v-icon>
      </v-btn>
    </template>

    <v-card>
      <form-validator-wrapper @submit="importProducts">
        <template #default="{ valid }">
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Import products') }}</span>
            <v-btn icon small depressed @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />

          <v-card-text>
            <switch-field v-model="update" :label="$t('Update existing products')" />
            <v-file-input
              :key="lastModifiedKey"
              v-model="products"
              type="file"
              outlined
              :label="$t('Select file...')"
              accept=".csv"
              :rules="rules"
              @input="onFileSet"
            />
            <div v-if="!products && errors" class="d-flex flex-column">
              <v-divider class="my-4" />
              <span class="error--text">{{ `${errors}` }}</span>
              <v-data-table :headers="headers" :items="errorsArray" hide-default-footer />
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text :loading="loading" type="submit" :disabled="!valid">
              {{ $t('Import') }}
            </v-btn>
          </v-card-actions>
        </template>
      </form-validator-wrapper>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { dataLoader } from '@/composable/loaders/dataLoader'
import { useI18n } from 'vue-i18n-bridge'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import useApi from '@/composable/useApi'

export interface ImportError {
  row: string
  column: string
  messages: string[]
}

export default defineComponent({
  name: 'ProductImport',
  components: { FormValidatorWrapper, SwitchField },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()

    const importLoader = dataLoader()
    const dialogVisible = ref(false)
    const update = ref(false)
    const products = ref<File>()

    const rules = [() => useNotEmptyValidationRule(products.value)]

    importLoader.onSuccess(() => {
      addSuccessToast(t('Products imported successfully'))
      emit('onSuccess')
      closeDialog()
    })

    importLoader.onError(() => {
      products.value = undefined
    })

    const lastModifiedKey = computed<string>(() => `file-${products.value?.lastModified}`)

    const onFileSet = () => {
      importLoader.errors.value = undefined
    }

    const closeDialog = (): void => {
      dialogVisible.value = false
      update.value = false
      products.value = undefined
      importLoader.errors.value = undefined
    }

    const importProducts = (): void => {
      if (!products.value) {
        return
      }

      const form = new FormData()
      form.append('products', products.value)
      form.append('update', String(update.value ? 1 : 0))

      importLoader.loadData(() => api.catalog.importProducts(form))
    }

    const transformErrorsToArray = (errors: { [p: string]: any }): ImportError[] => {
      return Object.entries(errors).reduce((previous, current) => {
        const [row, column] = current as [string, { [p: string]: any }]

        const values = Object.entries(column).reduce((previous, current) => {
          const [column, messages] = current as [string, string[]]

          return [...previous, { row, column, messages }]
        }, [] as ImportError[])

        return [...previous, ...values]
      }, [] as ImportError[])
    }

    const errorsArray = computed((): ImportError[] => {
      const { errors } = importLoader.errors.value as { [p: string]: any }
      if (!errors) {
        return []
      }

      return transformErrorsToArray(errors)
    })

    const headers = computed(() => [
      { text: t('Row'), value: 'row' },
      { text: t('Column'), value: 'column' },
      { text: t('Messages'), value: 'messages' }
    ])

    return {
      errorsArray,
      dialogVisible,
      update,
      products,
      rules,
      closeDialog,
      importProducts,
      onFileSet,
      lastModifiedKey,
      loading: importLoader.loading,
      errors: importLoader.errors,
      headers
    }
  }
})
</script>
