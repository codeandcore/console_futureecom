<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header :back-to="{ name: 'payment-methods' }" :header="$t('Add new payment method')">
          <template #actions>
            <v-btn :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
              {{ $t('Create') }}
            </v-btn>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div class="d-flex flex-column align-center">
          <payment-offline-inputs
            v-model="item"
            class="col-10 d-flex flex-column flex-gap-16"
            :errors="errors"
            @input="onItemChange"
          />
          <payment-method-inputs
            v-model="item"
            class="col-10 d-flex flex-column flex-gap-32"
            :errors="errors"
            @input="onItemChange"
          />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import PaymentMethodInputs from '@/components/domains/payments/PaymentMethodInputs.vue'
import PaymentOfflineInputs from '@/components/domains/payments/PaymentOfflineInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { PaymentOffline } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'PaymentMethodCreate',

  components: {
    ResourceHeader,
    PaymentOfflineInputs,
    ScrollableResource,
    PaymentMethodInputs
  },

  setup() {
    const router = useRouter()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)

    const item = ref<PaymentOffline>({
      name: '',
      description: '',
      enabled: false,
      code: '',
      image: '',
      testMode: false,
      translations: null
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      code: ['required', 'string']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.payments
        .createMethod({ ...item.value, translations })
        .then(({ code }) => {
          addSuccessToast(t('Created payment method'))
          router.push({ name: 'payment-method-update', params: { code } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create payment method'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      item,
      loading,
      errors,
      isValid,
      onItemChange,
      createHandler
    }
  }
})
</script>
