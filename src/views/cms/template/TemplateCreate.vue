<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header :back-to="{ name: 'templates' }" :header="$t('Add new template')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div class="d-flex flex-column align-center">
            <template-inputs v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TemplateInputs from '@/components/domains/cms/TemplateInputs.vue'
import useApi from '@/composable/useApi'
import type { CreateNewTemplate } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'TemplateCreate',
  components: {
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    TemplateInputs
  },

  setup() {
    const router = useRouter()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const item = ref<CreateNewTemplate>({
      code: '',
      name: ''
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true

      api.cms
        .newTemplate(item.value)
        .then(({ id }) => {
          addSuccessToast(t('Created template'))
          router.push({ name: 'template-update', params: { id } })
        })
        .catch((err) => addErrorToast(err.response?.data.message || t('Unable to create template')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading
    }
  }
})
</script>
