<template>
  <v-slide-y-reverse-transition mode="out-in">
    <div v-if="loading.get || loading.customer" class="d-flex justify-center my-4">
      <v-progress-circular size="32" color="primary" indeterminate />
    </div>

    <scrollable-resource v-else>
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'quotes' }"
          :header="`Quote for: ${item.customer.firstname} ${item.customer.lastname}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex flex-gap-16">
              <quote-action-delete v-if="canDelete" :value="item" @onSuccess="$router.push({ name: 'quotes' })" />
              <orderable-action-checkout
                :value="item"
                :checkout="checkoutData"
                :is-valid="isQuoteValid && isCheckoutValid"
                :disabled="item.status !== 'approved' || (triedToCheckout && !(isQuoteValid && isCheckoutValid))"
                @update:tried-to-checkout="triedToCheckout = true"
              />
            </div>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #content="{ availableHeight }">
        <div v-if="item && customer && !loading.get" class="d-flex">
          <scrollable class="ma-0 pa-0 col-8" :height="`${availableHeight}px`">
            <template #sticky>
              <v-slide-y-reverse-transition mode="out-in">
                <orderable-checkout-errors
                  v-if="triedToCheckout && !(isQuoteValid && isCheckoutValid)"
                  v-model="errors"
                  class="ma-0"
                  :show-errors="!isValid"
                />
              </v-slide-y-reverse-transition>
            </template>
            <template v-if="customer" #scrollable>
              <orderable-error-preview-dialog v-model="item" class="mx-4" />
              <cart-section-steps
                v-model="item"
                :customer.sync="customer"
                :readonly="!isQuoteEditable"
                :checkout.sync="checkoutData"
                :errors="{ ...cartErrors, ...checkoutErrors }"
                @input="onOrderableChange"
                @update:checkout="onCheckoutChange"
                @update:customer="onOrderableChange"
              />
            </template>
          </scrollable>
          <v-divider vertical class="mx-0" />
          <scrollable :height="`${availableHeight}px`" class="col-4 ma-0 pa-0">
            <template v-if="item" #scrollable>
              <quote-status-actions v-model="item" :readonly="!isQuoteEditable" />

              <v-divider />

              <cart-preview v-model="item" :readonly="!isQuoteEditable" @input="onOrderableChange" />
            </template>
          </scrollable>
        </div>
      </template>
    </scrollable-resource>
  </v-slide-y-reverse-transition>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { isGuest } from '@/libs/domains/carts/orderableHelpers'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import CartPreview from '@/views/cart/CartPreview.vue'
import CartSectionSteps from '@/views/cart/CartSectionSteps.vue'
import OrderableActionCheckout from '@/components/domains/carts/actions/OrderableActionCheckout.vue'
import OrderableCheckoutErrors from '@/views/cart/sections/OrderableCheckoutErrors.vue'
import OrderableErrorPreviewDialog from '@/components/domains/carts/preview/errors/OrderableErrorPreviewDialog.vue'
import QuoteActionDelete from '@/components/domains/carts/quotes/actions/QuoteActionDelete.vue'
import QuoteStatusActions from '@/components/domains/carts/quotes/QuoteStatusActions.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { CustomerDetailsResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import type {
  OrderableCheckout,
  OrderableGuestDetails,
  Quote
} from '@futureecom/futureecom-js/dist/services/cart-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'Quoteupdate',

  components: {
    OrderableActionCheckout,
    QuoteActionDelete,
    QuoteStatusActions,
    CartSectionSteps,
    OrderableCheckoutErrors,
    ResourceHeader,
    OrderableErrorPreviewDialog,
    ScrollableResource,
    Scrollable,
    CartPreview
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const { canDelete } = useCrudChecker('cart\\quote')

    const api = useApi()

    const loading = reactive({
      get: true,
      checkout: false,
      customer: false
    })

    const item = ref<Quote>()
    const customer = ref<OrderableGuestDetails | CustomerDetailsResponse>()
    const checkoutData = ref<OrderableCheckout>({ payment_method: '' })

    const triedToCheckout = ref(false)

    const isQuoteEditable = computed(() => item.value?.status === 'processing')

    const { isValid: isQuoteValid, errors: cartErrors, ...cartValidator } = useValidator()
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

    api.carts
      .getQuote(`${route.params.id}`)
      .then(async (quote) => {
        item.value = quote

        if (isGuest(quote.customer)) {
          customer.value = quote.customer
          loading.get = false
          return
        }

        await initCustomer(quote.customer.customer_id)
      })
      .catch(() => {
        addErrorToast('Quote not found')
        router.push({ name: 'quotes' })
      })
      .finally(() => (loading.get = false))

    return {
      triedToCheckout,
      item,
      canDelete,
      loading,
      customer,
      checkoutData,
      cartErrors,
      checkoutErrors,
      onOrderableChange,
      onCheckoutChange,
      isQuoteEditable,
      isQuoteValid,
      isCheckoutValid
    }
  }
})
</script>
