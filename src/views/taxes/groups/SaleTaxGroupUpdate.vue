<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource>
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'sale-tax-groups' }"
          :header="`Sale Tax Group: ${item.name}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <sale-tax-group-action-delete
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
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import SaleTaxGroupActionDelete from '@/components/domains/taxes/SaleTaxGroup/actions/SaleTaxGroupActionDelete.vue'
import SaleTaxGroupInputs from '@/components/domains/taxes/SaleTaxGroupInputs.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'SaleTaxGroupUpdate',

  components: {
    ResourceHeader,
    SaleTaxGroupInputs,
    SaleTaxGroupActionDelete,
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

    const { canCreate, canUpdate, canDelete } = useCrudChecker('taxes\\taxgroup')

    const item = ref<TaxRateGroup>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      zone_code: ['required', 'string'],
      tax_rate_ids: ['required', 'array', 'min:1']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'sale-tax-groups' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'sale-tax-group-create' }) : redirectToGrid()
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

      api.taxes
        .updateTaxRateGroup(item.value.id, item.value)
        .then((val) => {
          addSuccessToast(t('Updated sale tax group'))
          item.value = val
          setModel(val)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.taxes
      .getTaxRateGroup(`${route.params.id}`)
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
