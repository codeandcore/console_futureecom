<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column" data-cy="product-menu" eager>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'products' }"
            :header="`Product: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <product-action-delete
                  v-if="$canAny('delete,catalog\\product', 'manage,catalog\\product') && !isBundlePart"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @success="redirectToProductsGrid"
                />
                <v-btn
                  v-if="$canAny('update,catalog\\product', 'manage,catalog\\product')"
                  depressed
                  color="primary"
                  :disabled="!valid"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template v-for="section in requiredSections" #[`tab-label-${section}`]="{ item }">
          <span :key="section" class="required">
            <label>{{ item.name }}</label>
          </span>
        </template>

        <template v-if="item" #content-top>
          <div v-if="isBundlePart" :key="item.id" class="d-flex flex-column align-center">
            <product-bundle-warning :items="item.associated_with_bundles" class="mt-3 col-10" />
          </div>
        </template>

        <template v-for="section in sections" #[`content-${section.code}`]="{ content }">
          <div v-if="item" :key="`content-${section.code}-${item.updated_at}`" class="d-flex flex-column align-center">
            <component
              :is="content.component"
              v-model="item"
              class="mt-3 col-10"
              :validator="validator"
              @onTranslationUpdate="onTranslationUpdate"
            />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { getProductWithoutVariants } from '@/libs/domains/catalog/products'
import { isBundle } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useProduct, useProductValidator } from '@/composable/resources/useProduct'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ProductActionDelete from '@/components/domains/products/actions/ProductActionDelete.vue'
import ProductBrand from '@/views/catalog/product/sections/ProductBrand.vue'
import ProductBundleWarning from '@/components/domains/products/ProductBundleWarning.vue'
import ProductCategories from '@/views/catalog/product/sections/ProductCategories.vue'
import ProductComponents from '@/views/catalog/product/sections/ProductComponents.vue'
import ProductDescription from '@/views/catalog/product/sections/ProductDescription.vue'
import ProductDetails from '@/views/catalog/product/sections/ProductDetails.vue'
import ProductDimensions from '@/views/catalog/product/sections/ProductDimensions.vue'
import ProductExtras from '@/views/catalog/product/sections/ProductExtras.vue'
import ProductImages from '@/views/catalog/product/sections/ProductImages.vue'
import ProductInventory from '@/views/catalog/product/sections/ProductInventory.vue'
import ProductPricing from '@/views/catalog/product/sections/ProductPricing.vue'
import ProductProperties from '@/views/catalog/product/sections/ProductProperties.vue'
import ProductRelated from '@/views/catalog/product/sections/ProductRelated.vue'
import ProductRestrictions from '@/views/catalog/product/sections/ProductRestrictions.vue'
import ProductSettings from '@/views/catalog/product/sections/ProductSettings.vue'
import ProductTags from '@/views/catalog/product/sections/ProductTags.vue'
import ProductVariants from '@/views/catalog/product/sections/ProductVariants.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { Product, ProductTranslations } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'

export type ProductSections =
  | 'details'
  | 'descriptions'
  | 'pricing'
  | 'inventory'
  | 'images'
  | 'extras'
  | 'properties'
  | 'related'
  | 'categories'
  | 'brand'
  | 'tags'
  | 'variants'
  | 'components'
  | 'settings'
  | 'restrictions'
  | 'dimensions'

export default defineComponent({
  name: 'ProductUpdate',

  components: {
    ResourceHeader,
    ProductActionDelete,
    ProductBundleWarning,
    ScrollableResource,
    FormValidatorWrapper
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const route = useRoute()
    const router = useRouter()

    const api = useApi()

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const { canRead: canReadCategories } = useCrudChecker('catalog\\category')
    const { canRead: canReadBrands } = useCrudChecker('catalog\\brand')
    const { canRead: canReadTags } = useCrudChecker('catalog\\tag')

    const item = ref<Product>()
    const bundle = computed(() => (item.value ? isBundle(item.value) : false))
    const isBundlePart = computed(() => (item.value?.associated_with_bundles || []).length > 0)

    const onTranslationUpdate = (val: { code: string; value: ProductTranslations }) => {
      if (!item.value) {
        return
      }
      const translations = dotProp.get<Product['translations']>(item.value, `translations`, {}) || {}

      translations[val.code] = { ...translations[val.code], ...val.value }
      item.value = { ...item.value, translations }
    }

    const routeRedirect = () => {
      const option = `${route.params.option}`
      if (item.value && ((bundle.value && option === 'variants') || (!bundle.value && option === 'components'))) {
        router.push({ name: 'product-update', params: { options: '' } })
      }
      if (option === 'categories' && !canReadCategories.value) {
        router.push({ name: 'product-update', params: { options: '' } })
      }
    }

    const requiredSections = computed(() => {
      const defaultSections = ['details', 'inventory', 'pricing']
      return bundle.value ? [...defaultSections, 'components'] : defaultSections
    })

    const sections = computed((): ScrollableResourceDefinitions<ProductSections>[] => {
      if (!item.value) {
        return []
      }

      const val: ScrollableResourceDefinitions<ProductSections>[] = [
        { code: 'details', name: t('Details'), component: ProductDetails },
        { code: 'descriptions', name: t('Description'), component: ProductDescription },
        { code: 'pricing', name: t('Pricing'), component: ProductPricing },
        { code: 'inventory', name: t('Inventory'), component: ProductInventory },
        { code: 'images', name: t('Images'), component: ProductImages },
        { code: 'extras', name: t('Extras'), component: ProductExtras },
        { code: 'properties', name: t('Properties'), component: ProductProperties }
      ]

      if (canReadCategories.value) {
        val.push({ code: 'categories', name: t('Categories'), component: ProductCategories })
      }

      if (canReadBrands.value) {
        val.push({ code: 'brand', name: t('Brand'), component: ProductBrand })
      }
      if (canReadTags.value) {
        val.push({ code: 'tags', name: t('Tags'), component: ProductTags })
      }

      val.push({ code: 'related', name: t('Related'), component: ProductRelated })

      if (item.value.classification === 'bundle') {
        val.push({ code: 'components', name: t('Components'), component: ProductComponents })
      } else {
        val.push({ code: 'variants', name: t('Variants'), component: ProductVariants })
      }

      val.push(
        { code: 'settings', name: t('Settings'), component: ProductSettings },
        { code: 'restrictions', name: t('Restrictions'), component: ProductRestrictions },
        { code: 'dimensions', name: t('Dimensions'), component: ProductDimensions }
      )

      return val
    })

    const onErrorFetch = () => {
      addErrorToast(t('Product not found'))
      const { canCreate } = useCrudChecker('catalog\\brand')
      canCreate ? router.push({ name: 'product-create' }) : redirectToProductsGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }
      const { cleanTranslations } = useProduct()

      const product = cleanTranslations(getProductWithoutVariants(structuredClone(item.value)))

      loading.update = true
      api.catalog
        .updateProduct(item.value.id, product)
        .then((val) => {
          addSuccessToast(t('Updated product'))
          item.value = val
        })
        .catch(() => addErrorToast(t('Unable to update product')))
        .finally(() => (loading.update = false))
    }

    const redirectToProductsGrid = () => router.push({ name: 'products' })

    const fetchProduct = () => {
      api.catalog
        .getProduct(`${route.params.id}`)
        .then((val) => (item.value = val))
        .catch(() => onErrorFetch())
        .finally(() => (loading.get = false))
    }

    watch(item, routeRedirect, { immediate: true })
    watch(
      () => route.params,
      (val) => {
        if (val.id) {
          fetchProduct()
        }
      },
      { immediate: true }
    )

    return {
      item,
      loading,
      validator: useProductValidator(),
      sections,
      requiredSections,
      isBundlePart,
      updateHandler,
      redirectToProductsGrid,
      onTranslationUpdate
    }
  }
})
</script>
