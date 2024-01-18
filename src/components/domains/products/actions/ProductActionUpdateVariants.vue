<template>
  <v-btn v-bind="$attrs" small depressed color="primary" :loading="loading" @click="updateVariants">
    {{ $t('Update Variants') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useProduct } from '@/composable/resources/useProduct'
import { useToasts } from '@/composable/useToasts'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import useApi from '@/composable/useApi'
import type { ProductConfigurable } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductActionUpdateVariants',

  props: {
    value: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    },
    variants: {
      type: Array as PropType<ProductConfigurable['variants']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const { getTranslatedVariants } = useProduct()

    const updateVariants = () => {
      const { removeEmptyTranslations } = useTranslationCleanup()

      const data = {
        variants: props.variants || [],
        translations: removeEmptyTranslations(getTranslatedVariants(props.value)) || null
      }

      loading.value = true
      emitLoadingState()

      api.catalog
        .updateProductVariant(props.value.id, data)
        .then((value) => {
          addSuccessToast(t('Variants updated'))
          emit('input', value)
        })
        .catch((err: any) => {
          addErrorToast(err.response.data.message || t('Unable to update variants'))
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      updateVariants,
      loading
    }
  }
})
</script>
