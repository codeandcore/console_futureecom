<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="redirectBack"
            :header="`Preset Page: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <preset-page-action-delete
                  v-if="canDelete && !item.protected"
                  :value="item"
                  :code="$route.params.preset"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToPresetPageGrid"
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
            <page-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-32" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PageInputs from '@/components/domains/cms/PageInputs.vue'
import PresetPageActionDelete from '@/components/domains/cms/actions/PresetPageActionDelete.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { PresetPage } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'PresetPageUpdate',
  components: {
    PresetPageActionDelete,
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    PageInputs
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const { canUpdate, canDelete, canCreate } = useCrudChecker('cms\\page')

    const { preset, id } = route.params
    const redirectBack = computed(() => ({ name: 'preset-pages', query: { preset, sort: ['-created_at'] } }))

    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<PresetPage>()

    const onErrorFetch = () => {
      addErrorToast(t('Taxonomy not found'))
      canCreate.value ? router.push(redirectBack.value) : redirectToPresetPageGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.cms
        .updatePresetPage(preset, id, item.value)
        .then((val) => {
          addSuccessToast(t("Updated preset's page"))
          item.value = val
        })
        .catch((err) => addErrorToast(err.response?.data.message || t("Unable to update preset's page")))
        .finally(() => (loading.update = false))
    }

    const redirectToPresetPageGrid = () => router.push(redirectBack.value).catch(Boolean)

    api.cms
      .getPresetPage(preset, id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      canUpdate,
      canDelete,
      item,
      redirectBack,
      updateHandler,
      redirectToPresetPageGrid,
      loading
    }
  }
})
</script>
