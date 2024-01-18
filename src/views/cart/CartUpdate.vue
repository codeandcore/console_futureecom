<template>
  <v-slide-y-reverse-transition mode="out-in">
    <div v-if="loading.cart || loading.customer || loading.addresses" class="d-flex justify-center my-4">
      <v-progress-circular size="32" color="primary" indeterminate />
    </div>

    <scrollable-resource v-else>
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'carts' }"
          :header="`Cart for: ${item.customer.firstname} ${item.customer.lastname}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex flex-gap-16">
              <cart-action-delete v-if="canDeleteCart" :value="item" @onSuccess="$router.push({ name: 'carts' })" />
              <orderable-action-checkout
                :value="item"
                :checkout="checkoutData"
                :is-valid="isCartValid && isCheckoutValid"
                :disabled="triedToCheckout && !(isCartValid && isCheckoutValid)"
                @update:tried-to-checkout="triedToCheckout = true"
              />
            </div>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #content="{ availableHeight }">
        <div v-if="item && customer && !loading.cart" class="d-flex">
          <scrollable class="ma-0 pa-0 col-8" :height="`${availableHeight}px`">
            <template #sticky>
              <v-slide-y-reverse-transition mode="out-in">
                <orderable-checkout-errors
                  v-if="triedToCheckout && !(isCartValid && isCheckoutValid)"
                  :value="{ ...cartErrors, ...checkoutErrors }"
                  class="ma-0"
                />
              </v-slide-y-reverse-transition>
            </template>
            <template v-if="customer" #scrollable>
              <orderable-error-preview-dialog v-model="item" class="mx-4" />
              <cart-section-steps
                v-model="item"
                :errors="{ ...cartErrors, ...checkoutErrors }"
                :checkout.sync="checkoutData"
                :customer.sync="customer"
                @input="onOrderableChange"
                @update:checkout="onCheckoutChange"
                @update:customer="onOrderableChange"
              />
            </template>
          </scrollable>
          <v-divider vertical class="mx-0" />
          <scrollable :height="`${availableHeight}px`" class="col-4 ma-0 pa-0">
            <template v-if="item" #scrollable>
              <div v-if="canRequestQuote">
                <div class="d-flex justify-end">
                  <cart-action-convert-to-quote :value="item" />
                </div>
                <v-divider />
              </div>

              <div class="px-6 py-4">
                <orderable-action-discount-update v-model="item" />
              </div>

              <v-divider />

              <div class="px-6 py-4">
                <orderable-action-disable-taxes v-model="item" />
              </div>

              <v-divider />

              <div class="px-6 py-4">
                <cart-action-lock v-model="item" />
              </div>

              <v-divider />

              <cart-preview v-model="item" @input="onOrderableChange" />
            </template>
          </scrollable>
        </div>
      </template>
    </scrollable-resource>
  </v-slide-y-reverse-transition>
</template>

<script lang="ts">
import { OrderableType } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { hasAddress, isGuest } from '@/libs/domains/carts/orderableHelpers'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import CartActionConvertToQuote from '@/components/domains/carts/actions/CartActionConvertToQuote.vue'
import CartActionDelete from '@/components/domains/carts/actions/CartActionDelete.vue'
import CartActionLock from '@/components/domains/carts/actions/CartActionLock.vue'
import CartPreview from '@/views/cart/CartPreview.vue'
import CartSectionSteps from '@/views/cart/CartSectionSteps.vue'
import OrderableActionCheckout from '@/components/domains/carts/actions/OrderableActionCheckout.vue'
import OrderableActionDisableTaxes from '@/components/domains/carts/actions/OrderableActionDisableTaxes.vue'
import OrderableActionDiscountUpdate from '@/components/domains/carts/actions/OrderableActionDiscountUpdate.vue'
import OrderableCheckoutErrors from '@/views/cart/sections/OrderableCheckoutErrors.vue'
import OrderableErrorPreviewDialog from '@/components/domains/carts/preview/errors/OrderableErrorPreviewDialog.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type {
  Cart,
  Orderable,
  OrderableCheckout,
  OrderableGuestDetails
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { CountriesSettings, QuoteSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'CartUpdate',

  components: {
    OrderableActionDiscountUpdate,
    OrderableActionDisableTaxes,
    OrderableActionCheckout,
    CartActionConvertToQuote,
    CartSectionSteps,
    OrderableCheckoutErrors,
    ResourceHeader,
    OrderableErrorPreviewDialog,
    CartActionDelete,
    CartActionLock,
    ScrollableResource,
    Scrollable,
    CartPreview
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canDelete: canDeleteCart } = useCrudChecker('cart\\cart')
    const { canRead: canReadQuote, canCreate: canCreateQuote } = useCrudChecker('cart\\quote')

    const api = useApi()

    const loading = reactive({
      cart: true,
      checkout: false,
      customer: false,
      addresses: false
    })

    const item = ref<Cart>()
    const customer = ref<OrderableGuestDetails | CustomerDetailsResponse>()
    const checkoutData = ref<OrderableCheckout>({ payment_method: '' })

    const triedToCheckout = ref(false)

    const { getSettings } = useSettings()
    const allowedCountries = getSettings<CountriesSettings['allowed_list']>('localisation.countries.allowed_list')
    const quoteSettings = getSettings<QuoteSettings>('general.quote')

    const { isValid: isCartValid, errors: cartErrors, ...cartValidator } = useValidator()
    const { isValid: isCheckoutValid, errors: checkoutErrors, ...checkoutValidator } = useValidator()

    const orderableRules: RuleDefinitions = {
      items: [{ rule: 'required', message: 'At least one product is required' }, 'array', 'min:1'],
      customer: [{ rule: 'required', message: 'Missing customer' }],
      billing_address: [{ rule: 'required', message: 'Missing billing address' }],
      shipping_address: [{ rule: 'required', message: 'Missing shipping address' }],
      shipping: [{ rule: 'required', message: 'Missing shipping method' }]
    }
    const checkoutRules: RuleDefinitions = { payment_method: [{ rule: 'required', message: 'Missing payment method' }] }

    const onOrderableChange = () => item.value && cartValidator.validate(item.value, orderableRules, true)

    const onCheckoutChange = () => {
      checkoutData.value && checkoutValidator.validate(checkoutData.value, checkoutRules, true)
    }

    const initCustomer = (customerId: string) => {
      loading.customer = true

      return api.customers
        .getCustomer(customerId)
        .then((val) => (customer.value = val))
        .catch(() => t('Unable to fetch customer'))
        .finally(() => (loading.customer = false))
    }

    const initAddresses = (cart: Cart, addresses: CustomerDetailsResponse['addresses']) => {
      const defaultAddress = (addresses || []).find((address) => address.is_default)

      if (!defaultAddress) {
        return Promise.resolve()
      }

      const { country_code: countryCode } = defaultAddress

      const allowedCountriesList = allowedCountries.value || []
      if (allowedCountriesList.length && !allowedCountriesList.includes(countryCode)) {
        return Promise.resolve()
      }

      return api.carts
        .updateAddressesInOrderable(
          { id: cart.id, type: OrderableType.CART },
          {
            shipping_address_id: defaultAddress.id,
            billing_address_id: defaultAddress.id
          }
        )
        .then((val) => {
          const isCart = (val: Orderable): val is Cart => val.type === OrderableType.CART
          addSuccessToast(t('Default addresses were applied'))
          if (isCart(val)) {
            item.value = val
          }
          onOrderableChange()
        })
        .catch(() => addErrorToast(t('Unable to set default addresses')))
        .finally(() => (loading.customer = false))
    }

    const canRequestQuoteState = computed(() => {
      if (!item.value) {
        return 'Missing cart'
      }

      if (!canReadQuote.value || !canCreateQuote.value) {
        return 'No permissions'
      }

      if (!item.value.customer) {
        return 'Missing customer'
      }

      const groupsIncluded = (item.value.customer.groups || []).filter((group) => {
        return (quoteSettings.value.allowed_customer_groups || []).includes(group.code)
      })

      if (!quoteSettings.value.enabled) {
        return 'Quote setting is not enabled'
      }

      if (!groupsIncluded.length) {
        return 'Invalid customer group'
      }

      if (!(item.value.items || []).length) {
        return 'No items'
      }

      if (!hasAddress(item.value, 'shipping_address')) {
        return 'Missing shipping address'
      }

      return !hasAddress(item.value, 'billing_address') ? 'Missing billing address' : ''
    })

    const canRequestQuote = computed(() => !canRequestQuoteState.value)

    api.carts
      .getCart(`${route.params.id}`)
      .then(async (cart) => {
        item.value = cart
        cartValidator.setModel(cart)
        onOrderableChange()
        onCheckoutChange()

        if (isGuest(cart.customer)) {
          customer.value = cart.customer
          loading.cart = false
          return
        }

        initCustomer(cart.customer.customer_id)
          .then(() => {
            if (customer.value && !cart.billing_address_id && !cart.shipping_address_id) {
              initAddresses(cart, (customer.value as CustomerDetailsResponse).addresses)
            }
          })
          .finally(() => (loading.cart = false))
      })
      .catch(() => {
        addErrorToast('Cart not found')
        router.push({ name: 'carts' })
      })

    return {
      triedToCheckout,
      item,
      canDeleteCart,
      loading,
      customer,
      checkoutData,
      canRequestQuote,
      cartErrors,
      checkoutErrors,
      onOrderableChange,
      onCheckoutChange,
      isCartValid,
      isCheckoutValid
    }
  }
})
</script>
