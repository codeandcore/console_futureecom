<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource>
      <template #header>
        <resource-header :back-to="{ name: 'tags' }" :header="$t('Add new tag')">
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
          <tag-inputs v-model="item" :errors="errors" @input="onItemChange" />
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
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TagInputs from '@/components/domains/tags/TagInputs.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { TagData } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TagCreate',

  components: {
    TagInputs,
    ResourceHeader,
    ScrollableResource
  },

  setup() {
    const router = useRouter()

    const { t } = useI18n()

    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const item = ref<TagData>({ name: '' })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      'name': ['required', 'string', 'empty_spaces', 'alpha_dash'],
      'translations.*.name': ['nullable', 'empty_spaces', 'alpha_dash']
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
        .createTag({ ...item.value, translations })
        .then(({ id }) => {
          addSuccessToast(t('Created tag'))
          router.push({ name: 'tag-update', params: { id } }).catch()
        })
        .catch((err) => {
          addErrorToast(t('Unable to create tag'))
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
