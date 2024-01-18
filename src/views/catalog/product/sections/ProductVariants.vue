<template>
  <v-container>
    <div class="d-flex justify-space-between align-center">
      <span>{{ $t('Variants') }}</span>
      <v-btn depressed color="primary" @click="addVariant">
        {{ $t('Add variant') }}
      </v-btn>
    </div>

    <translation-tabs v-if="hasProductVariants" :translatable-values="['variants']" class="px-0 mx-0 mt-4">
      <template #default.variants="{ code }">
        <div v-for="(variant, index) in variants" :key="`default-${variant.key}`">
          <expandable-content eager>
            <template #title>
              <div class="d-flex flex-column grey--text text-caption">
                <span>{{ 'Name' }}: {{ variant.name || 'N/A' }}</span>
                <span>{{ $t('Options') }}: {{ variant.options.join(', ') || 'N/A' }}</span>
              </div>
            </template>
            <template #after-icon>
              <product-action-delete-variant
                :key="variant.key"
                v-model="product"
                icon
                :variant="variant"
                :suppress-confirmation="!value.id"
              />
            </template>
            <template #content>
              <product-variants-input
                :key="`variants-${index}`"
                :value="variant"
                class="mx-4 my-4"
                :breadcrumb-error-code="`variants-${code}-${index}`"
                @input="updateVariant"
              />
            </template>
          </expandable-content>
        </div>
      </template>
      <template #variants="{ code, currentTab }">
        <div v-for="(variant, index) in translations(code).get()" :key="`${variant.key}-${code}`">
          <expandable-content eager>
            <template #title>
              <div class="d-flex flex-column grey--text text-caption">
                <span>{{ 'Name' }}: {{ variant.name || 'N/A' }}</span>
                <span>{{ $t('Options') }}: {{ variant.options.join(', ') || 'N/A' }}</span>
              </div>
            </template>
            <template #content>
              <product-variants-input
                v-if="getVariantSource(variant).value"
                :key="`variants-${index}-${code}-${currentTab}`"
                :value="variant"
                :source="getVariantSource(variant).value"
                class="mx-4 my-4"
                :breadcrumb-error-code="`variants-${code}-${index}`"
                @input="updateVariantTranslation($event, code)"
              />
            </template>
          </expandable-content>
        </div>
      </template>
    </translation-tabs>

    <div v-if="value.id">
      <div v-if="hasProductChildren" class="d-flex flex-column">
        <v-divider class="my-4" />
        <div class="d-flex justify-space-between align-center flex-gap-16">
          <span class="text-caption">
            {{ $t('product.variant.update') }}
          </span>
          <product-action-update-variants
            :loading.sync="loading.generateVariant"
            :disabled="loading.updateVariant"
            :variants="variants"
            :value="value"
            @input="onRegenerated"
          />
        </div>
      </div>
      <div v-if="hasProductAnyFilledVariants" class="d-flex flex-column">
        <v-divider class="my-4" />
        <div class="d-flex justify-space-between align-center flex-gap-16">
          <span class="text-caption">
            {{ $t('product.variant.generate') }}
          </span>
          <product-action-generate-variants
            v-model="product"
            :loading.sync="loading.updateVariant"
            :disabled="loading.generateVariant"
            :variants="getFilledVariants"
            @input="onRegenerated"
          />
        </div>
      </div>
    </div>

    <template v-if="hasProductChildren">
      <v-divider class="mt-5" />
      <h3 class="my-4">
        {{ $t('Product Variants') }}
      </h3>
      <product-variant-products v-model="children" :product="value" />
    </template>
  </v-container>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { hasChildren, hasVariants } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useTranslationCleanup } from '@/composable/useTranslationCleanup'
import { v4 as uuidv4 } from 'uuid'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import ProductActionDeleteVariant from '@/components/domains/products/actions/ProductActionDeleteVariant.vue'
import ProductActionGenerateVariants from '@/components/domains/products/actions/ProductActionGenerateVariants.vue'
import ProductActionUpdateVariants from '@/components/domains/products/actions/ProductActionUpdateVariants.vue'
import ProductVariantProducts from '@/components/domains/products/ProductVariantProducts.vue'
import ProductVariantsInput from '@/components/domains/products/inputs/ProductVariantsInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import dotProp from 'dot-prop'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { ProductConfigurable, ProductVariant } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductVariants',

  components: {
    ProductActionDeleteVariant,
    ProductActionUpdateVariants,
    ProductActionGenerateVariants,
    ProductVariantsInput,
    ExpandableContent,
    TranslationTabs,
    ProductVariantProducts
  },

  props: {
    value: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const product = computed({
      get: () => props.value,
      set: (product) => emit('input', product)
    })

    const children = computed({
      get: () => props.value.children,
      set: (children) => emit('input', { ...props.value, children })
    })

    const variants = computed({
      get: () => props.value.variants || [],
      set: (variants) => emit('input', { ...props.value, variants })
    })

    const tVariants = computed(() => props.value.translations || {})

    const loading = reactive({
      getProduct: false,
      generateVariant: false,
      updateVariant: false
    })

    const hasProductChildren = computed(() => hasChildren(props.value))
    const hasProductVariants = computed(() => hasVariants(props.value))

    const getFilledVariants = computed(() =>
      variants.value.filter(({ name, options }) => !!name && (options || []).length > 0)
    )
    const hasProductAnyFilledVariants = computed(() => getFilledVariants.value.length > 0)

    const template = (key?: string): ProductVariant => {
      const generateKey = () => key || uuidv4().toString()
      return {
        key: generateKey(),
        name: '',
        options: []
      }
    }

    const { forEachLanguage } = useTranslationCleanup()

    const refillVariantTranslations = () => {
      const defaultValue = (variants.value || []).map((variant) => ({
        key: variant.key,
        name: '',
        options: []
      }))

      forEachLanguage((lang: Language) => {
        if (translations(lang.code).get().length) {
          return
        }
        translations(lang.code).set(structuredClone(defaultValue))
      })
    }

    const addVariant = () => {
      const variant = template()
      variants.value = [variant, ...(variants.value || [])]
      forEachLanguage((lang: Language) => {
        const translatableVariant = translations(lang.code).get()
        const { key, name, options } = cloneDeep(variant)
        translations(lang.code).set([{ key, name, options }, ...translatableVariant])
      })
    }

    const updateVariant = (variant: ProductVariant) => {
      variants.value = variants.value.map((item) => (item.key === variant.key ? variant : item))
    }

    const updateVariantTranslation = (variant: ProductVariant, code: string) => {
      const updated = translations(code)
        .get()
        .map((item) => (item.key === variant.key ? variant : item))

      translations(code).set(updated)
    }

    const getVariantSource = (variant: ProductVariant) => {
      return computed(() => variants.value.find((item) => item.key === variant.key))
    }

    const translations = (code: string) => ({
      get: (): ProductVariant[] => {
        const translated = dotProp.get<ProductVariant[]>(tVariants.value, `${code}.variants`, [])
        return variants.value.map((variant) => {
          const tVariant = translated.find((item) => item.key === variant.key)
          return !tVariant ? template(variant.key) : tVariant
        })
      },
      set: (variants: any) => emit('onTranslationUpdate', { code, value: { variants } })
    })

    refillVariantTranslations()

    const onRegenerated = (regenerated: Pick<ProductConfigurable, 'children' | 'variants'>) => {
      emit('input', { ...props.value, children: regenerated.children, variants: regenerated.variants || [] })
    }

    return {
      variants,
      children,
      hasProductVariants,
      hasProductChildren,
      hasProductAnyFilledVariants,
      getFilledVariants,
      addVariant,
      getVariantSource,
      updateVariant,
      translations,
      updateVariantTranslation,
      onRegenerated,
      loading,
      product
    }
  }
})
</script>
