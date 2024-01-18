<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header v-if="item" :back-to="redirectBack" :header="`Page: ${item.name}`" :subheader="item.id">
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <template-page-action-delete
                  v-if="$canAny('manage,cms\\page', 'delete,cms\\page') && !item.protected"
                  :value="item"
                  :code="$route.params.template"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToTemplatePageGrid"
                />
                <v-btn
                  v-if="$canAny('manage,cms\\page', 'update,cms\\page')"
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
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TemplatePageActionDelete from '@/components/domains/cms/actions/TemplatePageActionDelete.vue'
import useApi from '@/composable/useApi'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'PageUpdate',

  components: {
    TemplatePageActionDelete,
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
    const { canCreate } = useCrudChecker('cms\\page')

    const { template, id } = route.params
    const redirectBack = computed(() => ({ name: 'pages', query: { template, sort: ['-created_at'] } }))

    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<Page>()

    const redirectToTemplatePageGrid = () => router.push(redirectBack.value).catch(Boolean)

    const onErrorFetch = () => {
      addErrorToast(t('Page not found'))
      canCreate.value ? router.push({ name: 'page-create', params: { template } }) : redirectToTemplatePageGrid()
    }

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.cms
        .updatePage(template, id, item.value)
        .then((val) => {
          addSuccessToast(t('Updated page'))
          item.value = val
        })
        .catch((err) => addErrorToast(err.response?.data.message || t('Unable to update page')))
        .finally(() => (loading.update = false))
    }

    api.cms
      .getPage(template, id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      redirectBack,
      updateHandler,
      redirectToTemplatePageGrid,
      loading
    }
  }
})
</script>
