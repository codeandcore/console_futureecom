<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column" data-cy="product-menu" eager>
        <template #header>
          <resource-header :back-to="{ name: 'products' }" :header="$t('Add new product')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
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

        <template #content-top>
          <div v-if="isBundlePart" :key="item.id" class="d-flex flex-column align-center">
            <product-bundle-warning :items="item.associated_with_bundles" class="mt-3 col-10" />
          </div>
        </template>

        <template v-for="section in sections" #[`content-${section.code}`]="{ content }">
          <div v-if="item" :key="`content-${section.code}`" class="d-flex flex-column align-center">
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
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { isBundle } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useProduct, useProductValidator } from '@/composable/resources/useProduct'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
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
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type {
  Product,
  ProductCreate,
  ProductTranslations
} from '@futureecom/futureecom-js/dist/services/catalog-service'
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
  name: 'ProductCreate',

  components: {
    ResourceHeader,
    RtlChevronIcon,
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
    const loading = ref(false)

    const { cleanTranslations, productTemplate } = useProduct()

    const item = ref<ProductCreate>(productTemplate())
    const bundle = computed(() => isBundle(item.value))

    const { canRead: canReadCategories } = useCrudChecker('catalog\\category')
    const { canRead: canReadBrands } = useCrudChecker('catalog\\brand')
    const { canRead: canReadTags } = useCrudChecker('catalog\\tag')

    const onTranslationUpdate = (val: { code: string; value: ProductTranslations }) => {
      const translations = dotProp.get<Product['translations']>(item.value, `translations`, {}) || {}
      translations[val.code] = { ...translations[val.code], ...val.value }
      item.value = { ...item.value, translations }
    }

    const routeRedirect = () => {
      const option = `${route.params.option}`
      if ((bundle.value && option === 'variants') || (!bundle.value && option === 'components')) {
        router.push({ name: 'product-create', params: { options: '' } })
      }
      if (option === 'categories' && !canReadCategories.value) {
        router.push({ name: 'product-create', params: { options: '' } })
      }
    }

    watch(() => route.params, routeRedirect, { immediate: true })

    const requiredSections = computed(() => {
      const defaultSections = ['details', 'inventory', 'pricing']
      return bundle.value ? [...defaultSections, 'components'] : defaultSections
    })

    const sections = computed((): ScrollableResourceDefinitions<ProductSections>[] => {
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

    const createHandler = async () => {
      if (!item.value || item.value.price === null) {
        return
      }

      const { translations } = cleanTranslations(structuredClone(item.value))

      loading.value = true

      api.catalog
        .createProduct({ ...item.value, translations })
        .then(({ id }) => {
          addSuccessToast(t('Created product'))
          router.push({ name: 'product-update', params: { id } })
        })
        .catch(() => addErrorToast(t('Unable to create product')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading,
      isBundlePart: computed(() => (item.value.associated_with_bundles || []).length > 0),
      validator: useProductValidator(),
      sections,
      requiredSections,
      onTranslationUpdate
    }
  }
})
</script>
