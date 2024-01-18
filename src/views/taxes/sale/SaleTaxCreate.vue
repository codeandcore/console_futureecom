<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'sale-taxes' }" :header="$t('Add new sale tax')">
          <template #actions>
            <v-btn v-bind="$attrs" :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
              {{ $t('Create') }}
            </v-btn>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div class="d-flex flex-column align-center">
          <sale-tax-inputs
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
import { defineComponent, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import SaleTaxInputs from '@/components/domains/taxes/SaleTaxInputs.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseTaxRate } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'SaleTaxCreate',

  components: {
    ResourceHeader,
    SaleTaxInputs,
    ScrollableResource
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()

    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseTaxRate>({
      name: '',
      rate: 0
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      rate: ['required', 'numeric', 'min:0', { rule: 'max:1', message: t('Max value is: 100') }]
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.taxes
        .createTaxRate({ ...item.value, translations })
        .then(({ id }) => {
          addSuccessToast(t('Created sale tax'))
          router.push({ name: 'sale-tax-update', params: { id } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create sale tax'))
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
      isValid,
      errors,
      createHandler,
      onItemChange
    }
  }
})
</script>
