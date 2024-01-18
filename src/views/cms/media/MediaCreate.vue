<template>
  <v-form @submit.prevent="createHandler">
    <scrollable-resource class="d-flex flex-column">
      <template #header>
        <resource-header :back-to="{ name: 'media' }" :header="$t('Add new media')">
          <template #actions>
            <v-btn :disabled="!isValid" depressed color="primary" :loading="loading" type="submit">
              {{ $t('Create') }}
            </v-btn>
          </template>
        </resource-header>
        <v-divider />
      </template>
      <template #scrollable.content>
        <div class="d-flex flex-column align-center">
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
import { defineComponent, ref } from '@vue/composition-api'
import { transformMediaToFormData } from '@/libs/domains/cms/media/formatMedia'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import { useValidator } from '@/composable/validator/useValidator'
import MediaInputs from '@/components/domains/cms/media/MediaInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { Media } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'MediaCreate',

  components: {
    MediaInputs,
    ResourceHeader,
    ScrollableResource
  },

  setup() {
    const router = useRouter()

    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)

    const item = ref<Pick<Media, 'name'>>({ name: '' })

    const { errors, validate, isValid, setErrorsFromAPI } = useValidator(item.value)

    const rules: RuleDefinitions = {
      name: ['required', 'string'],
      image: ['required'],
      public_id: [
        'nullable',
        'empty_spaces',
        'max:256',
        {
          rule: 'regex:^(?!.*[?&#%<>+/])',
          message: 'Value should not contain special characters'
        }
      ]
    }

    const onItemChange = () => validate(item.value, rules)

    const createHandler = () => {
      validate(item.value, rules, true)

      if (!isValid.value) {
        return
      }

      loading.value = true

      const payload = transformMediaToFormData(item.value)

      api.cms
        .createMedia(payload)
        .then(({ id }) => {
          addSuccessToast(t('Created media'))
          router.push({ name: 'media-update', params: { id } })
        })
        .catch((err) => {
          addErrorToast(t('Unable to create media'))
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
      onItemChange,
      createHandler
    }
  }
})
</script>
