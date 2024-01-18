<template>
  <v-dialog v-if="hasProductChanged" v-model="showDialog" max-width="600">
    <template #activator="{ attrs, on }">
      <v-btn
        v-bind="{ ...$attrs, attrs }"
        small
        depressed
        color="primary"
        :loading="loading.generateVariants"
        v-on="on"
      >
        {{ $t('Generate Variants') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>{{ $t('Unsaved changes') }}</span>
        <v-btn icon small depressed @click="showDialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="mt-4">
        {{
          $t(
            'You have unsaved changes in your product. Without saving first, the newly generated variants will not include these changes. Would you like to save the product first and then generate the variants?'
          )
        }}
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="secondary" text small :disabled="loading.generateVariants" @click="generateVariants">
          {{ $t('Generate without changes') }}
        </v-btn>
        <v-btn color="primary" text :loading="loading.productUpdate" small @click="updateProductFirst">
          {{ $t('Save changes and generate') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn
    v-else
    v-bind="$attrs"
    small
    depressed
    color="primary"
    :loading="loading.generateVariants"
    @click="generateVariants"
  >
    {{ $t('Generate Variants') }}
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { getProductWithoutVariants } from '@/libs/domains/catalog/products'
import { useI18n } from 'vue-i18n-bridge'
import { useProduct } from '@/composable/resources/useProduct'
import { useToasts } from '@/composable/useToasts'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import useApi from '@/composable/useApi'
import type {
  ProductConfigurable,
  ProductVariantRequest
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductActionGenerateVariants',

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    },
    variants: {
      type: Array as PropType<ProductVariantRequest['variants']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()

    const product = computed(() => structuredClone(props.value))
    const hasProductChanged = ref(false)

    const showDialog = ref(false)
    const loading = reactive({
      productUpdate: false,
      generateVariants: false
    })

    watch(product, () => (hasProductChanged.value = true), { deep: true })

    const emitLoadingState = () => emit('update:loading', loading.productUpdate || loading.generateVariants)
    const { getTranslatedVariants, cleanTranslations } = useProduct()

    const updateProductFirst = async () => {
      loading.productUpdate = true
      emitLoadingState()

      const product = cleanTranslations(getProductWithoutVariants(structuredClone(props.value)))

      api.catalog
        .updateProduct(props.value.id, product)
        .then(() => generateVariants())
        .catch(() => addErrorToast(t('Unable to update product')))
        .finally(() => {
          loading.productUpdate = false
          emitLoadingState()
        })
    }

    const generateVariants = () => {
      const { removeEmptyTranslations } = useTranslationCleanup()

      showDialog.value = false

      const data = {
        variants: props.variants || [],
        translations: removeEmptyTranslations(getTranslatedVariants(props.value)) || null
      }

      loading.generateVariants = true
      emitLoadingState()

      api.catalog
        .generateProductVariant(props.value.id, data)
        .then((value) => emit('input', value))
        .catch(() => addErrorToast(t('Unable to generate variants')))
        .finally(() => {
          showDialog.value = false
          loading.generateVariants = false
          emitLoadingState()
        })
    }

    return {
      showDialog,
      generateVariants,
      loading,
      hasProductChanged,
      updateProductFirst
    }
  }
})
</script>
