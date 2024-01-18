<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'sale-tax-groups' }" :header="$t('Add new sale tax group')">
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
          <sale-tax-group-inputs
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
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import SaleTaxGroupInputs from '@/components/domains/taxes/SaleTaxGroupInputs.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseTaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'TaxGroupCreate',

  components: {
    ResourceHeader,
    SaleTaxGroupInputs,
    ScrollableResource
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()

    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseTaxRateGroup>({
      name: '',
      zone_code: '',
      shipping_taxable: false,
      tax_rate_ids: []
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      zone_code: ['required', 'string'],
      tax_rate_ids: ['required', 'array', 'min:1']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      api.taxes
        .createTaxRateGroup(item.value)
        .then(({ id }) => {
          addSuccessToast(t('Created sale tax group'))
          router.push({ name: 'sale-tax-group-update', params: { id } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create sale tax group'))
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
      createHandler,
      onItemChange
    }
  }
})
</script>
