<template>
  <v-dialog v-model="isDialogOpen" max-width="1200" scrollable>
    <template #activator="{ attrs, on }">
      <slot :attrs="attrs" :on="on" />
    </template>
    <form-validator-wrapper @submit="addToCart">
      <template #default="{ valid }">
        <v-card min-height="300">
          <v-card-title class="justify-space-between">
            <product-action-get v-if="isDialogOpen" :id="id" :loading.sync="loadingFetch" @input="onProductFetched" />
            <span v-if="loadingFetch || !product">{{ $t('Loading...') }}</span>
            <span v-else class="d-flex flex-gap-8">
              <span>{{ product.name }}</span>
              <span v-if="product.real_price">({{ $format.money.withStoreCurrency(product.real_price) }})</span>
            </span>
            <v-icon size="32" @click="isDialogOpen = false">close</v-icon>
          </v-card-title>

          <v-divider />

          <v-card-text v-if="loadingFetch || !product || !configuredProduct" class="d-flex justify-center align-center">
            <v-progress-circular size="50" color="primary" indeterminate />
          </v-card-text>

          <v-card-text v-else class="d-flex justify-space-between">
            <div v-if="configuredProduct" class="col-2">
              <cart-product-preview :value="configuredProduct" />
            </div>
            <div class="col-4">
              <v-tabs v-model="selectedSection">
                <v-tab v-for="(section, index) in sections" :key="`add-to-cart-option-${index}`">
                  <span>{{ $t(section.label) }}</span>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="selectedSection">
                <v-tab-item v-if="isConfigurable && product" key="options">
                  <cart-product-variant-select
                    v-if="hasVariants"
                    v-model="configuredProduct"
                    :product="product"
                    class="mt-6"
                  />
                  <cart-product-bundle
                    v-else-if="isBundle"
                    v-model="configuredBundle"
                    :product="product"
                    class="mt-6"
                  />
                </v-tab-item>
                <v-tab-item v-if="hasExtras" key="extras">
                  <cart-product-extras v-model="additional" :extras="product.extras" />
                </v-tab-item>

                <v-tab-item key="notes">
                  <orderable-product-note v-model="additional" class="mt-4" />
                </v-tab-item>
              </v-tabs-items>
            </div>
            <div v-if="configuredProduct" class="col-4">
              <orderable-product-quantity
                v-model="additional"
                class="d-flex flex-column flex-gap-16"
                :product="configuredProduct"
              />
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions v-if="!loadingFetch" class="d-flex justify-end pa-3">
            <v-btn color="primary" depressed :disabled="!valid" type="submit" :loading="loading">
              {{ $t('Add to cart') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </form-validator-wrapper>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { hasVariants } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import CartProductBundle from '@/components/domains/carts/product/CartProductBundle.vue'
import CartProductExtras from '@/components/domains/carts/product/CartProductExtras.vue'
import CartProductPreview from '@/components/domains/carts/product/CartProductPreview.vue'
import CartProductVariantSelect from '@/components/domains/carts/product/CartProductVariantSelect.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import OrderableProductNote from '@/components/domains/carts/product/OrderableProductNote.vue'
import OrderableProductQuantity from '@/components/domains/carts/product/OrderableProductQuantity.vue'
import ProductActionGet from '@/components/domains/products/actions/ProductActionGet.vue'
import useApi from '@/composable/useApi'
import type {
  Orderable,
  OrderableItemComponent,
  OrderableItemData
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableAddProductDialog',

  components: {
    OrderableProductNote,
    CartProductExtras,
    CartProductVariantSelect,
    CartProductBundle,
    CartProductPreview,
    OrderableProductQuantity,
    FormValidatorWrapper,
    ProductActionGet
  },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()

    const isDialogOpen = ref(false)
    const selectedSection = ref(0)

    const product = ref<Product>()

    const configuredProduct = ref<Product>()
    const configuredBundle = ref<OrderableItemComponent[]>()

    const additional = ref<OrderableItemData>({
      product_id: '',
      quantity: 1
    })

    const loadingFetch = ref(false)
    const loading = ref(false)

    const hasExtras = computed((): boolean => !!product.value && !!product.value.extras?.length)
    const isBundle = computed(() => product.value && product.value.classification === 'bundle')
    const hasProductVariants = computed((): boolean => !!product.value && hasVariants(product.value))
    const isConfigurable = computed((): boolean => isBundle.value || hasProductVariants.value)

    const sections = computed(() => {
      const tabs = []
      if (isConfigurable.value) {
        tabs.push({ label: 'Options' })
      }
      if (hasExtras.value) {
        tabs.push({ label: 'Extras' })
      }
      tabs.push({ label: 'Notes' })

      return tabs
    })

    const onProductFetched = (val: Product) => {
      product.value = val
      configuredProduct.value = val
      additional.value = { ...additional.value, quantity: val.inventory.min_per_order || 1 }
    }

    const addToCart = (): void => {
      if (!product.value || !configuredProduct.value || !additional.value.quantity) {
        return
      }

      loading.value = true

      api.carts
        .addItemsToOrderable(props.value, [
          {
            ...additional.value,
            product_id: configuredProduct.value.id || '',
            components: product.value.classification === 'bundle' ? configuredBundle.value : undefined
          }
        ])
        .then((val) => {
          emit('input', val)
          addSuccessToast(t('Product has been added'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to add item'))
        .finally(() => {
          isDialogOpen.value = false
          loading.value = false
        })
    }

    return {
      additional,
      isDialogOpen,
      product,
      loading,
      loadingFetch,
      addToCart,
      onProductFetched,
      selectedSection,
      sections,
      hasExtras,
      hasVariants,
      isBundle,
      configuredProduct,
      configuredBundle,
      isConfigurable
    }
  }
})
</script>
