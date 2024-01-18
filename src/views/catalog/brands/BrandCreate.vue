<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'brands' }" :header="$t('Add new brand')">
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
          <brand-inputs v-model="item" :errors="errors" @input="onItemChange" />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import BrandInputs from '@/components/domains/brands/BrandInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BrandData } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'BrandCreate',

  components: {
    BrandInputs,
    ResourceHeader,
    ScrollableResource
  },

  setup() {
    const router = useRouter()

    const { t } = useI18n()

    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const item = ref<BrandData>({
      name: '',
      slug: '',
      description: null,
      image_url: null
    })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      slug: ['nullable', 'empty_spaces']
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.catalog
        .createBrand({ ...item.value, translations })
        .then(({ id }) => {
          addSuccessToast(t('Created brand'))
          router.push({ name: 'brand-update', params: { id } }).catch()
        })
        .catch((err) => {
          addErrorToast(t('Unable to create brand'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          setErrorsFromAPI(err.response?.data.errors || {})
        })
        .finally(() => (loading.value = false))
    }

    return {
      item,
      loading,
      errors,
      isValid,
      createHandler,
      onItemChange
    }
  }
})
</script>
