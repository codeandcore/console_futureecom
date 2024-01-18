<template>
  <v-form @submit.prevent="updateHandler">
    <scrollable-resource>
      <template #header>
        <resource-header v-if="item" :back-to="{ name: 'media' }" :header="`Media: ${item.name}`" :subheader="item.id">
          <template #actions>
            <div v-if="item" class="d-flex flex-gap-16">
              <media-action-delete
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
          <media-inputs
            v-model="item"
            class="col-10 d-flex flex-column flex-gap-32"
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
import { transformMediaToFormData } from '@/libs/domains/cms/media/formatMedia'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import MediaActionDelete from '@/components/domains/cms/media/actions/MediaActionDelete.vue'
import MediaInputs from '@/components/domains/cms/media/MediaInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Media } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'MediaUpdate',

  components: {
    MediaActionDelete,
    MediaInputs,
    ResourceHeader,
    ScrollableResource
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { canCreate, canUpdate, canDelete } = useCrudChecker('cms\\media')
    const { t } = useI18n()

    const api = useApi()

    const { id } = route.params

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const item = ref<Media>()

    const { errors, validate, isValid, setErrorsFromAPI, setModel } = useValidator()

    const rules: RuleDefinitions = {
      name: ['required', 'string']
    }

    const onItemChange = () => item.value && validate(item.value, rules)

    const redirectToGrid = () => router.push({ name: 'media' })

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        canCreate.value ? router.push({ name: 'media-create' }) : redirectToGrid()
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

      const payload = transformMediaToFormData(item.value)

      api.cms
        .updateMedia(id, payload)
        .then((val) => {
          addSuccessToast(t('Updated media'))
          item.value = val
          setModel(item.value)
        })
        .catch((err) => onRequestError(err))
        .finally(() => (loading.update = false))
    }

    api.cms
      .getMedia(id)
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
