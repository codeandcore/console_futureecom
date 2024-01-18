<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'roles' }" :header="$t('Add new role')">
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
          <role-inputs
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
import RoleInputs from '@/components/domains/auth/RoleInputs.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseRole } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'RoleCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    RoleInputs
  },

  setup() {
    const router = useRouter()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseRole>({
      name: '',
      permission_ids: [],
      client_ids: [],
      user_ids: []
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      permission_ids: ['array', 'min:1']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      api.auth
        .createRole(item.value)
        .then((val) => {
          addSuccessToast(t('Created role'))
          router.push({ name: 'role-update', params: { id: val.id } }).catch()
        })
        .catch((err) => {
          addErrorToast(t('Unable to create role'))
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
