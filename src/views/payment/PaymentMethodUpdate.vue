<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'payment-methods' }"
          :header="`Payment Method: ${item.name}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <payment-method-action-delete
                v-if="isOffline && canDelete"
                :value="item"
                :loading.sync="loading.delete"
                :disabled="loading.update"
                @success="redirectToGrid"
                @error="onRequestError"
              />
              <v-btn
                v-if="canUpdate"
                depressed
                color="primary"
                :disabled="!isValid"
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
      <template #scrollable.content>
        <div v-if="item" class="d-flex flex-column align-center">
          <payment-method-inputs
            v-model="item"
            class="col-10 d-flex flex-column flex-gap-16"
            :errors="errors"
            @input="onItemChange"
          />
          <component
            :is="paymentComponent[$route.params.code] || paymentComponent['offline']"
            v-model="item"
            :errors="errors"
            class="col-10 mb-10 d-flex flex-column flex-gap-32"
            @input="onItemChange"
          />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineAsyncComponent, defineComponent, reactive, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import PaymentMethodActionDelete from '@/components/domains/payments/actions/PaymentMethodActionDelete.vue'
import PaymentMethodInputs from '@/components/domains/payments/PaymentMethodInputs.vue'
import PaymentOfflineInputs from '@/components/domains/payments/PaymentOfflineInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { AsyncComponent } from 'vue'
import type { PaymentMethod } from '@/libs/domains/paymentMethods/codes'
import type { PaymentMethodResponse } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { RuleDefinitions } from '@/types/validator'

const paymentComponent: Record<PaymentMethod, AsyncComponent> = {
  braintree: defineAsyncComponent(() => import('@/components/domains/payments/PaymentBraintreeInputs.vue')),
  cardknox: defineAsyncComponent(() => import('@/components/domains/payments/PaymentCardknoxInputs.vue')),
  paypal: defineAsyncComponent(() => import('@/components/domains/payments/PaymentPaypalInputs.vue')),
  poynt_terminal: defineAsyncComponent(() => import('@/components/domains/payments/PaymentPoyntTerminalInputs.vue')),
  poynt: defineAsyncComponent(() => import('@/components/domains/payments/PaymentPoyntInputs.vue')),
  stripe: defineAsyncComponent(() => import('@/components/domains/payments/PaymentStripeInputs.vue')),
  bank_transfer: defineAsyncComponent(() => import('@/components/domains/payments/PaymentBankTransferInputs.vue')),
  cardknox_pos: defineAsyncComponent(() => import('@/components/domains/payments/PaymentCardknoxPosInputs.vue')),
  converge: defineAsyncComponent(() => import('@/components/domains/payments/PaymentConvergeInputs.vue')),
  tranzila: defineAsyncComponent(() => import('@/components/domains/payments/PaymentTranzilaInputs.vue')),
  offline: defineAsyncComponent(() => import('@/components/domains/payments/PaymentOfflineInputs.vue')),
  heartland: defineAsyncComponent(() => import('@/components/domains/payments/PaymentHeartlandInputs.vue')),
  cash_on_delivery: defineAsyncComponent(() => import('@/components/domains/payments/PaymentOfflineInputs.vue'))
}

export default defineComponent({
  name: 'PaymentMethodUpdate',

  components: {
    ResourceHeader,
    PaymentMethodActionDelete,
    PaymentOfflineInputs,
    ScrollableResource,
    PaymentMethodInputs
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('payments\\method')

    const api = useApi()
    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const paymentCode: string = `${route.params.code}`
    const isOffline = !(paymentCode in paymentComponent)

    const item = ref<PaymentMethodResponse>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const providerRules: Record<string | PaymentMethod, RuleDefinitions> = {
      braintree: {
        merchantId: ['required', 'string'],
        tokenizationKey: ['required', 'string'],
        publicKey: ['required', 'string'],
        privateKey: ['required', 'string']
      },
      cardknox: {
        xKey: ['required', 'string'],
        iFieldsKey: ['required', 'string']
      },
      paypal: {
        clientId: ['required', 'string'],
        secret: ['required', 'string']
      },
      poynt_terminal: {
        business_id: ['required', 'string'],
        store_id: ['required', 'string'],
        application_id: ['required', 'string']
      },
      poynt: {
        business_id: ['required', 'string'],
        store_id: ['required', 'string'],
        application_id: ['required', 'string'],
        private_key: ['required', 'string']
      },
      stripe: {
        apiKey: ['required', 'string'],
        publishableKey: ['required', 'string']
      },
      bank_transfer: {
        account_number: ['required', 'string']
      },
      cardknox_pos: {
        xKey: ['required', 'string'],
        iFieldsKey: ['required', 'string'],
        deviceIpAddress: ['required', 'string'],
        deviceIpPort: ['required', 'string']
      },
      converge: {
        merchantId: ['required', 'string'],
        username: ['required', 'string'],
        password: ['required', 'string']
      },
      tranzila: {
        supplier: ['required', 'string'],
        terminal_password: ['required', 'string'],
        type: ['required', 'string']
      }
    }

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      code: ['required', 'string'],
      ...providerRules[paymentCode]
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'payment-methods' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'payment-method-create' }) : redirectToGrid()
        return
      }
      if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
        setErrorsFromAPI(data.errors || {})
      }
      addErrorToast(data.message)
    }

    const updateHandler = (): void => {
      if (!item.value) {
        return
      }

      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.update = true
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.payments
        .updateMethod(item.value.id, { ...item.value, translations })
        .then((val) => {
          addSuccessToast(t('Updated payment method'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.payments
      .getMethod(paymentCode)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => onRequestError(err))
      .finally(() => (loading.get = false))

    return {
      item,
      loading,
      paymentComponent,
      isOffline,
      canUpdate,
      canDelete,
      errors,
      isValid,
      updateHandler,
      redirectToGrid,
      onItemChange,
      onRequestError
    }
  }
})
</script>
