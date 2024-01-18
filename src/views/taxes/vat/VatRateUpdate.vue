<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'vat-rates' }"
          :header="`Vat: ${item.name}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <vat-rate-action-delete
                v-if="canDelete"
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
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import VatRateActionDelete from '@/components/domains/taxes/vat/actions/VatRateActionDelete.vue'
import VatRateInputs from '@/components/domains/taxes/VatRateInputs.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { VatRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateUpdate',

  components: {
    ResourceHeader,
    VatRateActionDelete,
    ScrollableResource,
    VatRateInputs
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

    const { canCreate, canUpdate, canDelete } = useCrudChecker('taxes\\vat')

    const item = ref<VatRate>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules = computed(
      (): RuleDefinitions => ({
        name: ['required', 'string'],
        value: ['required', 'numeric', 'min:0', { rule: 'max:1', message: t('Max value is: 100') }]
      })
    )

    const onItemChange = () => item.value && validate(item.value, rules.value)

    const redirectToGrid = () => router.push({ name: 'vat-rates' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'vat-rate-create' }) : redirectToGrid()
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

      validate(item.value, rules.value, true)

      if (!isValid.value) {
        return
      }

      loading.update = true

      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.taxes
        .updateVatRate(item.value.id, { ...item.value, translations })
        .then((val) => {
          addSuccessToast(t('Updated vat rate'))
          item.value = val
          setModel(val)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.taxes
      .getVatRate(`${route.params.id}`)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => onRequestError(err))
      .finally(() => (loading.get = false))

    return {
      item,
      canUpdate,
      canDelete,
      loading,
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
