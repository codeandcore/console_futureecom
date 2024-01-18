<template>
  <v-dialog :value="!!cartErrorReasons" persistent>
    <v-card class="d-flex flex-column">
      <v-card-title>
        <span>{{ errorMessage }}</span>
      </v-card-title>

      <v-divider />

      <v-card-text v-if="loading.get" class="d-flex justify-center align-center">
        <v-progress-circular size="50" color="primary" indeterminate />
      </v-card-text>

      <v-card-text v-else-if="Object.keys(errorReasons).length" class="mt-4">
        <div v-for="([itemId, reason], index) in errors" :key="`error-${index}-${itemId}`" class="d-flex flex-column">
          <v-divider v-if="index > 0" class="my-4" />

          <div v-if="reason.product_id && !!getProduct(reason.product_id).value" class="d-flex flex-gap-16">
            <product-image-preview
              v-if="reason.product_id"
              :value="getProduct(reason.product_id).value.image_url"
              max-width="75"
            />
            <div class="d-flex flex-column flex-grow-1">
              <div class="d-flex justify-space-between">
                <div class="d-flex flex-column">
                  <span>{{ getProduct(reason.product_id).value.name }}</span>
                  <span class="text-caption grey--text">{{ getProduct(reason.product_id).value.sku }}</span>
                </div>

                <orderable-action-delete-item
                  v-if="reason.product_id && isProductInCart(reason.product_id).value"
                  :value="value"
                  :item-id="itemId"
                  suppress-confirmation
                  icon
                  :is-loading.sync="loading.delete"
                  :disabled="loading.delete"
                  @input="onItemDeleteSuccess(itemId, $event)"
                />
              </div>
              <orderable-error-reason-message class="d-flex flex-column flex-grow-1 my-2" :value="reason" />
            </div>
          </div>

          <orderable-error-reason-message v-else class="d-flex flex-column flex-grow-1 my-2" :value="reason" />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex justify-end">
        <v-btn depressed @click="acceptAll">
          {{ $t('Accept all') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { orderableEventBus } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import OrderableActionDeleteItem from '@/components/domains/carts/actions/OrderableActionDeleteItem.vue'
import OrderableErrorReasonMessage from '@/components/domains/carts/preview/errors/OrderableErrorReasonMessage.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import useApi from '@/composable/useApi'
import type { Cart, Orderable, OrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { OrderableErrorProductReasonMessage, OrderableErrorReasons } from '@/types/Orderable'
import type { OrderableEvent } from '@/views/cart/communication/OrderableEventBus'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableErrorPreviewDialog',

  components: { ProductImagePreview, OrderableErrorReasonMessage, OrderableActionDeleteItem },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    }
  },

  emits: {
    input: (_cart: Orderable): boolean => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const router = useRouter()

    const cartErrorReasons = ref<OrderableErrorReasons>()
    orderableEventBus.on('orderable-error', (e) => cartErrorHandler(e))

    const api = useApi()

    const products = ref<Product[]>()

    const loading = reactive({
      get: false,
      delete: false
    })

    const errorMessage = computed(() => cartErrorReasons.value?.message || '')
    const errorReasons = computed(() => cartErrorReasons.value?.reasons || {})
    const errorCart = computed(() => cartErrorReasons.value?.data)

    const errors = computed((): [string, OrderableErrorProductReasonMessage][] => Object.entries(errorReasons.value))

    const fetchInvalidProducts = (id: string[]) => {
      loading.get = true
      api.catalog
        .products({ filter: { id }, perPage: -1, with: ['children'] })
        .then((val) => (products.value = val.data))
        .catch((err) => console.error(err.response?.data))
        .finally(() => (loading.get = false))
    }

    const cartErrorHandler = (event: OrderableEvent['orderable-error']) => {
      if (event.status >= 400 && event.status < 404 && event.data) {
        cartErrorReasons.value = event.data
        return
      }
      if (event.status === 404) {
        addErrorToast('Cart not found')
        router.push({ name: props.value?.type === 'cart' ? 'carts' : 'quotes' })
      }
      addErrorToast(t(event.toastMessage || 'An error occurred'))
    }

    watch(
      errorCart,
      () => {
        const ids = Object.values(errorReasons.value)
          .map((reason: OrderableErrorProductReasonMessage) => reason.product_id || '')
          .filter(Boolean)

        if (ids.length) {
          fetchInvalidProducts(ids)
        }
      },
      { deep: true, immediate: true }
    )

    const getProduct = (product_id: string) => {
      return computed((): Product | undefined => {
        return (products.value || []).find((item) => item.id === product_id)
      })
    }

    const isProductInCart = (product_id: string) => {
      return computed((): boolean => {
        if (!errorCart.value) {
          return false
        }

        return !!errorCart.value.items.find((item: OrderableItem) => item.product_id === product_id)
      })
    }

    const onItemDeleteSuccess = (itemId: string, updatedCart: Cart) => {
      loading.delete = false

      const filteredReasons = Object.keys(errorReasons.value)
        .filter((key) => key !== itemId)
        .reduce((previous, [key, value]) => ({ ...previous, [key]: value }), {})

      const hasReasons = Boolean(Object.keys(filteredReasons).length)

      cartErrorReasons.value = hasReasons
        ? {
            reasons: filteredReasons,
            message: errorMessage.value,
            data: updatedCart
          }
        : undefined

      if (!hasReasons) {
        emit('input', updatedCart)
      }
    }

    const acceptAll = () => {
      if (errorCart.value) {
        emit('input', errorCart.value)
      }
      cartErrorReasons.value = undefined
    }

    return {
      cartErrorReasons,
      errorMessage,
      errorReasons,
      loading,
      isProductInCart,
      getProduct,
      acceptAll,
      errors,
      onItemDeleteSuccess
    }
  }
})
</script>
