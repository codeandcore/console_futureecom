<template>
  <delete-button v-bind="{ ...$attrs, loading }" @click="deleteHandler">
    <template v-if="!!value.id" #dialog-content>
      {{ $t('This operation will regenerate all variants. Do you want to continue?') }}
    </template>
  </delete-button>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { ProductConfigurable, ProductVariant } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductActionDeleteVariant',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    },
    variant: {
      type: Object as PropType<ProductVariant>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)
    const { forEachLanguage } = useTranslationCleanup()

    const deleteLocally = () => {
      const variants = (props.value.variants || [])?.filter((item: ProductVariant) => item.key !== props.variant.key)

      const translations = props.value.translations || {}
      forEachLanguage((lang: Language) => {
        const translatedVariants = dotProp.get(translations, `${lang.code}.variants`, [])
        const filtered = translatedVariants.filter((item: ProductVariant) => item.key !== props.variant.key)
        dotProp.set(translations, `${lang.code}.variants`, filtered)
      })

      emit('input', { ...props.value, variants, translations })
    }

    const deleteRemotely = () => {
      if (!props.variant.key) {
        return
      }

      loading.value = true
      emitLoadingState()

      api.catalog
        .deleteProductVariants(props.value.id, { variants: [{ key: props.variant.key }] })
        .then(() => {
          addSuccessToast(t('Variant deleted'))
          api.catalog.getProduct(props.value.id).then((value) => emit('input', value))
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete variant'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          emit('error', err.response?.data)
        })

        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    const deleteHandler = () => (props.value.id ? deleteRemotely() : deleteLocally())

    return {
      loading,
      deleteHandler
    }
  }
})
</script>
