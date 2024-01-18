<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'sale-taxes' }"
          :header="`Sale Tax: ${item.name}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <sale-tax-action-delete
                v-if="canUpdate"
                :value="item"
                :loading.sync="loading.delete"
                :disabled="loading.update"
                @success="redirectToGrid"
                @error="onRequestError"
              />
              <v-btn
                v-if="canDelete"
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
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import SaleTaxActionDelete from '@/components/domains/taxes/sale/actions/SaleTaxActionDelete.vue'
import SaleTaxInputs from '@/components/domains/taxes/SaleTaxInputs.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { TaxRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'SaleTaxUpdate',

  components: {
    ResourceHeader,
    SaleTaxActionDelete,
    SaleTaxInputs,
    ScrollableResource
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const route = useRoute()
    const router = useRouter()

    const api = useApi()

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('taxes\\taxrate')

    const item = ref<TaxRate>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      rate: ['required', 'numeric', 'min:0', { rule: 'max:1', message: t('Max value is: 100') }]
    }

    const onItemChange = () => item.value && validate(item.value, rules)
    const redirectToGrid = () => router.push({ name: 'sale-taxes' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'sale-tax-create' }) : redirectToGrid()
        return
      }
      if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
        setErrorsFromAPI(data.errors || {})
      }
      addErrorToast(data.message)
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.update = true

      const { code, ...rest } = item.value
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.taxes
        .updateTaxRate(item.value.id, { ...rest, translations })
        .then((val) => {
          addSuccessToast(t('Updated sale tax'))
          item.value = val
          setModel(val)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.taxes
      .getTaxRate(`${route.params.id}`)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => onRequestError(err))
      .finally(() => (loading.get = false))

    return {
      canUpdate,
      canDelete,
      errors,
      isValid,
      item,
      loading,
      onItemChange,
      updateHandler,
      redirectToGrid,
      onRequestError
    }
  }
})
</script>
