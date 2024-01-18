<template>
  <v-select
    v-bind="$attrs"
    v-model="classification"
    :items="classifications"
    :label="$t('Product classification')"
    outlined
  />
</template>

<script lang="ts">
import { ProductClassification } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { computed, defineComponent } from '@vue/composition-api'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import dotProp from 'dot-prop'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductClassification',

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const classifications: ProductClassification[] = [ProductClassification.COMMON, ProductClassification.BUNDLE]

    const classification = computed({
      get: () => props.value.classification,

      set: (classification: ProductClassification) => {
        const isBundle = classification === ProductClassification.BUNDLE

        const { quantity, track, is_bundle_exclusive } = props.value.inventory

        let translations = props.value.translations
        if (translations) {
          const { forEachLanguage } = useTranslationCleanup()

          forEachLanguage((langCode: Language) => {
            translations = dotProp.set(translations || {}, `${langCode.code}.variants`, isBundle ? undefined : [])
          })
        }

        const updatedProduct = {
          ...props.value,
          classification,
          inventory: {
            ...props.value.inventory,
            quantity: isBundle ? 0 : quantity,
            track: isBundle || track,
            is_bundle_exclusive: isBundle ? undefined : is_bundle_exclusive
          },
          translations
        }

        emit('input', {
          ...updatedProduct,
          components: isBundle ? [] : undefined,
          variants: !isBundle ? [] : undefined
        })
      }
    })

    return {
      classification,
      classifications
    }
  }
})
</script>
