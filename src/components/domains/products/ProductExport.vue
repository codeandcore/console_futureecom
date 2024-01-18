<template>
  <v-dialog v-model="dialogVisible" max-width="600">
    <template #activator="{ on }">
      <v-btn v-bind="$attrs" color="primary" depressed @click="dialogVisible = true" v-on="on">
        <span>{{ $t('Export') }}</span>
        <v-icon small class="ms-2">cloud_download</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>{{ $t('Export products') }}</span>
        <v-btn icon small depressed @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <switch-field v-model="withChildren" :label="$t('Include products children in exported file')" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text :loading="loading" @click="exportProducts">
          {{ $t('Export') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import SwitchField from '@/components/common/SwitchField.vue'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'ProductExport',

  components: { SwitchField },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)
    const dialogVisible = ref(false)
    const withChildren = ref(false)

    const closeDialog = (): void => {
      dialogVisible.value = false
      withChildren.value = false
    }

    const exportProducts = (): void => {
      loading.value = true
      api.catalog
        .exportProducts({ with_children: withChildren.value })
        .then((val) => {
          addSuccessToast(t('Products has been exported successfully'))

          const link = window.document.createElement('a')
          link.href = window.URL.createObjectURL(val)
          link.setAttribute('download', 'products.csv')
          link.click()
          closeDialog()
        })
        .catch((err) => {
          addErrorToast(t('Export has failed'))
        })
        .finally(() => (loading.value = false))
    }

    return {
      dialogVisible,
      withChildren,
      closeDialog,
      exportProducts,
      loading
    }
  }
})
</script>
