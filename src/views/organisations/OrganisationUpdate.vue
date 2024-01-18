<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header
          v-if="item"
          :back-to="{ name: 'organisations' }"
          :header="`Organisation: ${item.name}`"
          :subheader="`${item.id}`"
        >
          <template #actions>
            <div class="d-flex justify-end flex-gap-16">
              <organisation-action-delete
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
      <template v-if="item" #scrollable.content>
        <div v-if="item" class="d-flex flex-column align-center">
          <organisation-inputs
            v-model="item"
            :errors="errors"
            class="my-6 col-10 d-flex flex-column flex-gap-32"
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
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import OrganisationActionDelete from '@/components/domains/organisations/actions/OrganisationActionDelete.vue'
import OrganisationInputs from '@/components/domains/organisations/OrganisationInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  components: {
    ResourceHeader,
    OrganisationActionDelete,
    ScrollableResource,
    OrganisationInputs
  },

  setup() {
    const { t } = useI18n()

    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { canCreate, canUpdate, canDelete } = useCrudChecker('settings\\organisations')

    const api = useApi()

    const { id } = route.params

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Organisation>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      'name': ['required', 'string', 'not_numbers_only'],
      'domains.console.custom': ['nullable', 'domain'],
      'domains.pos.custom': ['nullable', 'domain']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const mappedErrors = computed(() => ({
      ...errors.value,
      console_domain: errors.value['domains.console.custom'],
      pos_domain: errors.value['domains.pos.custom']
    }))

    const redirectToGrid = () => router.push({ name: 'organisations' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'organisation-create' }) : redirectToGrid()
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

      const { name, domains } = item.value

      const org = {
        name,
        console_domain: domains?.console?.custom || null,
        pos_domain: domains?.pos?.custom || null
      }

      api.settings
        .updateOrganisation(item.value.id, org)
        .then((val) => {
          addSuccessToast(t('Updated organisation'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.settings
      .organisation(parseInt(`${id}`))
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
      errors: mappedErrors,
      isValid,
      loading,
      onItemChange,
      updateHandler,
      redirectToGrid,
      onRequestError
    }
  }
})
</script>
