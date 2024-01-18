<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'clients' }" :header="$t('Add new client')">
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
          <client-inputs
            v-if="!createdClient"
            v-model="item"
            class="my-6 col-10 d-flex flex-column flex-gap-32"
            :errors="errors"
            @input="onItemChange"
          />
          <client-created-warning v-else :value="createdClient" />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js'
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ClientCreatedWarning from '@/components/domains/auth/clients/ClientCreatedWarning.vue'
import ClientInputs from '@/components/domains/auth/ClientInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { ClientCreated, ClientData } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'ClientCreate',

  components: {
    ClientCreatedWarning,
    ResourceHeader,
    ScrollableResource,
    ClientInputs
  },

  setup() {
    const { t } = useI18n()

    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const item = ref<ClientData>({
      name: '',
      default: false,
      providers: [],
      meta: {
        application: ApplicationType.STOREFRONT
      },
      role_ids: [],
      permission_ids: []
    })

    const createdClient = ref<ClientCreated>()

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      'name': ['required', 'string'],
      'providers': ['required', 'array', 'min:1'],
      'meta.application': ['required', 'string']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      api.auth
        .createClient(item.value)
        .then((val) => {
          createdClient.value = val
          addSuccessToast(t('Created client'))
        })
        .catch((err) => {
          addErrorToast(t('Unable to create client'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createdClient,
      createHandler,
      loading,
      onItemChange,
      errors,
      isValid
    }
  }
})
</script>
