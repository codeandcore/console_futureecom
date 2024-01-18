<template>
  <v-btn v-bind="$attrs" :loading="loading" depressed @click="reindexHandler">
    {{ $attrs.label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'ProductActionReindex',

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:reindexLoading', loading.value)

    const reindexHandler = () => {
      loading.value = true
      emitLoadingState()

      api.catalog
        .reindexProducts()
        .then(() => addSuccessToast(t('Products reindexed')))
        .catch((err: any) => {
          addErrorToast(err.response.data.message || t('Unable to reindex products'))
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      reindexHandler,
      loading
    }
  }
})
</script>
