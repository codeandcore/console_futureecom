<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource>
      <template #header>
        <resource-header v-if="item" :back-to="{ name: 'tags' }" :header="`Tag: ${item.name}`" :subheader="item.id">
          <template #actions>
            <div v-if="item" class="d-flex flex-gap-16">
              <tag-action-delete
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
          <tag-inputs v-model="item" :errors="errors" @input="onItemChange" />
        </div>
      </template>
    </scrollable-resource>
  </v-form>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { removeEmptyFields } from '@/libs/objects'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute, useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TagActionDelete from '@/components/domains/tags/actions/TagActionDelete.vue'
import TagInputs from '@/components/domains/tags/TagInputs.vue'
import useApi from '@/composable/useApi'
import type { RuleDefinitions } from '@/types/validator'
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TagUpdate',

  components: {
    TagActionDelete,
    TagInputs,
    ResourceHeader,
    ScrollableResource
  },

  setup() {
    const { t } = useI18n()

    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\tag')

    const api = useApi()

    const { id } = route.params

    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Tag>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      'name': ['required', 'string', 'empty_spaces', 'alpha_dash'],
      'translations.*.name': ['nullable', 'empty_spaces', 'alpha_dash']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'tags' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'tag-create' }) : redirectToGrid()
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
      const translations = removeEmptyFields(item.value.translations || {}) || null

      api.catalog
        .updateTag(`${id}`, { ...item.value, translations })
        .then((val) => {
          addSuccessToast(t('Updated tag'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.catalog
      .getTag(`${id}`)
      .then((val) => {
        item.value = val
        setModel(item.value)
      })
      .catch((err) => {
        addErrorToast(t('Tag not found'))
        if (err.response?.data.message) {
          addErrorToast(err.response?.data.message)
        }
        canCreate.value ? router.push({ name: 'tag-create' }) : redirectToGrid()
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
      onRequestError
    }
  }
})
</script>
