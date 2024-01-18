<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header
          :back-to="{ name: 'admin-update', params: { id: item.user_id } }"
          :header="$t('Add new representative')"
        >
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
          <representative-input
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
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import RepresentativeInput from '@/components/domains/auth/RepresentativeInput.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { NewRepresentative } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'RepresentativeCreate',

  components: {
    ScrollableResource,
    RepresentativeInput,
    ResourceHeader
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)

    const item = ref<NewRepresentative>({
      customer_id: '',
      user_id: route.params.admin,
      commission_percentage: null,
      commission_on_tax: false,
      commission_on_shipping: false
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      commission_percentage: ['required', 'numeric', 'min:0', 'max:100'],
      customer_id: ['required', 'string']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      api.commissions
        .createRepresentative(item.value)
        .then(({ id }) => {
          addSuccessToast(t('Created representative'))
          router.push({ name: 'representative-update', params: { admin: route.params.admin, id } }).catch()
        })
        .catch((err) => {
          addErrorToast(t('Unable to create representative'))
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
      onItemChange,
      loading,
      errors,
      isValid
    }
  }
})
</script>
