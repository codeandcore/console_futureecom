<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'vat-rates' }" :header="$t('Add new vat rate')">
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <v-btn v-bind="$attrs" :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
                {{ $t('Create') }}
              </v-btn>
            </div>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div class="d-flex flex-column align-center">
          <vat-rate-inputs
            v-model="item"
            class="my-6 col-10 d-flex flex-column flex-gap-32"
            :errors="errors"
            @input="onItemChange"
          />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import VatRateInputs from '@/components/domains/taxes/VatRateInputs.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    VatRateInputs
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()

    const api = useApi()
    const loading = ref(false)

    const item = ref<Vat>({
      name: '',
      value: 0,
      translations: undefined,
      product_ids: [],
      shipping_ids: []
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules = computed(
      (): RuleDefinitions => ({
        name: ['required', 'string'],
        value: ['required', 'numeric', 'min:0', { rule: 'max:1', message: t('Max value is: 100') }]
      })
    )

    const onItemChange = () => validate(item.value, rules.value)

    const createHandler = () => {
      validate(item.value, rules.value, true)
      if (!isValid.value) {
        return
      }

      loading.value = true

      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.taxes
        .createVatRate({ ...item.value, translations })
        .then(({ id }) => {
          addSuccessToast(t('Created vat rate'))
          router.push({ name: 'vat-rate-update', params: { id } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create vat rate'))
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
