<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'templates' }"
            :header="`Template: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <template-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToTemplateGrid"
                />
                <v-btn
                  v-if="canUpdate"
                  depressed
                  color="primary"
                  :disabled="!valid"
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
            <preset-install-inputs v-model="presetId" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PresetInstallInputs from '@/components/domains/cms/PresetInstallInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TemplateActionDelete from '@/components/domains/cms/actions/TemplateActionDelete.vue'
import useApi from '@/composable/useApi'
import type { Template } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'TemplateUpdate',

  components: {
    TemplateActionDelete,
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    PresetInstallInputs
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Template>()
    const presetId = ref('')

    const { canReadOrganisationPresets } = useCmsPresetChecker('preset')
    const { canCreate, canDelete, canUpdate } = useCrudChecker('cms\\template')

    if (!canReadOrganisationPresets.value) {
      router.push({ name: 'templates' })
    }

    const onErrorFetch = () => {
      addErrorToast(t('Template not found'))
      canCreate.value ? router.push({ name: 'template-create' }) : redirectToTemplateGrid()
    }

    const redirectToTemplateGrid = () => router.push({ name: 'templates' })

    const updateHandler = () => {
      if (!presetId.value || !item.value) {
        return
      }

      loading.update = true

      api.cms.installPreset(item.value.id, presetId.value).then(() => router.push({ name: 'templates' }))
    }

    api.cms
      .getTemplate(route.params.id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      presetId,
      updateHandler,
      loading,
      redirectToTemplateGrid,
      canDelete,
      canUpdate
    }
  }
})
</script>
