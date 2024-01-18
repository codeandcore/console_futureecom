<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource>
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'admin-update', params: { id: $route.params.admin } }"
          :header="$t('Representative')"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex justify-end flex-gap-16">
              <representative-action-delete
                v-if="canDelete"
                :value="item"
                :loading.sync="loading.delete"
                :disabled="loading.update"
                @success="redirectToGrid"
                @error="onDeleteError"
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
          <representative-input
            v-model="item"
            class="my-6 col-10 d-flex flex-column flex-gap-32"
            disable-customer
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
import RepresentativeActionDelete from '@/components/domains/auth/representative/actions/RepresentativeActionDelete.vue'
import RepresentativeInput from '@/components/domains/auth/RepresentativeInput.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Representative } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'RepresentativeUpdate',

  components: {
    RepresentativeActionDelete,
    ScrollableResource,
    RepresentativeInput,
    ResourceHeader
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('commission\\representative')

    const api = useApi()

    const { id, admin } = route.params

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Representative>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      commission_percentage: ['required', 'numeric', 'min:0', 'max:100'],
      customer_id: ['required', 'string']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'admin-update', params: { id: item.value?.user_id || '' } })

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.update = true

      api.commissions
        .updateRepresentative(id, item.value)
        .then((val) => {
          addSuccessToast(t('Updated representative'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => {
          addErrorToast(t('Unable to update representative'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.update = false))
    }

    const onDeleteError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.UNPROCESSABLE_CONTENT) {
        setErrorsFromAPI(data.errors || {})
        return
      }
      if (status === HTTPResponseCode.NOT_FOUND) {
        redirectToGrid()
      }
    }

    api.commissions
      .getRepresentative(id)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => {
        addErrorToast(t('Representative not found'))
        if (err.response?.data.message) {
          addErrorToast(err.response?.data.message)
        }
        canCreate.value ? router.push({ name: 'representative-create', params: { admin } }) : redirectToGrid()
      })
      .finally(() => (loading.get = false))

    return {
      canUpdate,
      canDelete,
      item,
      errors,
      isValid,
      loading,
      updateHandler,
      redirectToGrid,
      onItemChange,
      onDeleteError
    }
  }
})
</script>
