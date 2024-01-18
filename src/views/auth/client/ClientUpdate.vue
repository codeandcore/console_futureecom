<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource>
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'clients' }"
          :header="`Client: ${item.name}`"
          :subheader="item.id"
        >
          <template #actions>
            <div v-if="item" class="d-flex flex-gap-16">
              <client-action-delete
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
          <client-inputs
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
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ClientActionDelete from '@/components/domains/auth/clients/actions/ClientActionDelete.vue'
import ClientInputs from '@/components/domains/auth/ClientInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'ClientUpdate',

  components: {
    ResourceHeader,
    ClientActionDelete,
    ScrollableResource,
    ClientInputs
  },

  setup() {
    const { t } = useI18n()

    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { canCreate, canUpdate, canDelete } = useCrudChecker('auth\\client')

    const api = useApi()

    const { id } = route.params

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Client>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      'name': ['required', 'string'],
      'providers': ['required', 'array', 'min:1'],
      'meta.application': ['required', 'string']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'clients' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'client-create' }) : redirectToGrid()
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

      api.auth
        .updateClient(`${id}`, item.value)
        .then((val) => {
          addSuccessToast(t('Updated client'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.auth
      .getClient(`${id}`)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => onRequestError(err))
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
      onRequestError
    }
  }
})
</script>
