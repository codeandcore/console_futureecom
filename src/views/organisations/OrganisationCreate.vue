<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header :back-to="{ name: 'organisations' }" :header="$t('Add new organisation')">
          <template #actions>
            <div class="d-flex justify-end flex-gap-16">
              <v-btn :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
                {{ $t('Create') }}
              </v-btn>
            </div>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div class="d-flex flex-column align-center">
          <div class="my-6 col-10 d-flex flex-column flex-gap-32">
            <organisation-inputs
              v-model="item"
              class="d-flex flex-column flex-gap-16"
              :errors="errors"
              @input="onItemChange"
            />

            <v-divider />

            <switch-field v-model="toggleCreateAdmin" :label="$t('Create admin for the organisation (optional)')" />

            <organisation-admin-inputs
              v-if="toggleCreateAdmin"
              v-model="item"
              :errors="errors"
              class="d-flex flex-column flex-gap-16"
              @input="onItemChange"
            />
          </div>
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { refreshToken } from '@/libs/api'
import { useI18n } from 'vue-i18n-bridge'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import OrganisationAdminInputs from '@/components/domains/organisations/OrganisationAdminInputs.vue'
import OrganisationInputs from '@/components/domains/organisations/OrganisationInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import useApi from '@/composable/useApi'
import type { NewOrganisation, OrganisationStoreAdmin } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  components: {
    SwitchField,
    ResourceHeader,
    OrganisationAdminInputs,
    ScrollableResource,
    OrganisationInputs
  },

  setup() {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()
    const router = useRouter()

    const loading = ref(false)

    const item = ref<NewOrganisation>({ name: '' })

    const { fetchOrganisations } = useOrganisations()

    const api = useApi()

    const organisationAdminTemplate = (): OrganisationStoreAdmin => ({
      name: '',
      email: '',
      password: ''
    })

    const { errors, validate, isValid, setModel, setErrors, setErrorsFromAPI } = useValidator<NewOrganisation>(
      item.value
    )

    const rules = computed((): RuleDefinitions => {
      const orgRules: RuleDefinitions = {
        name: ['required', 'string', 'not_numbers_only'],
        console_domain: ['nullable', 'domain'],
        pos_domain: ['nullable', 'domain']
      }

      const adminRules: RuleDefinitions = {
        'admin.name': ['required', 'string'],
        'admin.email': ['required', 'email'],
        'admin.password': ['required', 'string', 'min:8']
      }

      return 'admin' in item.value ? { ...orgRules, ...adminRules } : orgRules
    })

    const onItemChange = () => validate(item.value, rules.value)

    const toggleCreateAdmin = computed({
      get: () => 'admin' in item.value,
      set: (val: boolean) => {
        const { admin, ...rest } = item.value
        item.value = val ? { ...item.value, admin: organisationAdminTemplate() } : { ...rest }

        setModel(item.value)

        const { console_domain, pos_domain, name } = errors.value
        setErrors({ console_domain, pos_domain, name })
        onItemChange()
      }
    })

    const createHandler = async (): Promise<void> => {
      validate(item.value, rules.value, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      try {
        const organisation = await api.settings.createOrganisation(item.value)
        addSuccessToast(t('Created organisation'))

        await fetchOrganisations()
        if (refreshToken.value) {
          await api.auth.refreshAccessToken(refreshToken.value || '')
        }
        await router.push({ name: 'organisation-update', params: { id: `${organisation.id}` } })
      } catch (err: any) {
        if (err.response?.data.message) {
          addErrorToast(err.response?.data.message)
        }
        setErrorsFromAPI(err.response?.data.errors || {})
      } finally {
        loading.value = false
      }
    }

    return {
      item,
      errors,
      isValid,
      loading,
      toggleCreateAdmin,
      onItemChange,
      createHandler
    }
  }
})
</script>
