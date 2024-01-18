<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header :back-to="{ name: 'permissions' }" :header="$t('Add new permission')">
          <template #actions>
            <v-btn :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
              {{ $t('Create') }}
            </v-btn>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div v-if="item" class="d-flex flex-column align-center">
          <permission-inputs
            v-model="item"
            class="my-6 col-10 d-flex flex-column flex-gap-32 required"
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
import PermissionInputs from '@/components/domains/auth/PermissionInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BasePermission } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'PermissionCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    PermissionInputs
  },

  setup() {
    const router = useRouter()
    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)

    const item = ref<BasePermission>({
      action: '',
      name: '',
      resource: '',
      store: '',
      org: ''
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      org: ['required', 'string'],
      store: ['required', 'string'],
      resource: ['required', 'string'],
      action: ['required', 'string']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      api.auth
        .createPermission(item.value)
        .then(({ id }) => {
          addSuccessToast(t('Created permission'))
          router.push({ name: 'permission-update', params: { id } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create permission'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading,
      onItemChange,
      errors,
      isValid
    }
  }
})
</script>
