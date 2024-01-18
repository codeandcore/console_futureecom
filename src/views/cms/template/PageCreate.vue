<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header :back-to="redirectBack" :header="$t('Add new page')">
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
            <page-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-32" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useToasts } from '@/composable/useToasts'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PageInputs from '@/components/domains/cms/PageInputs.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { NewPage } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'PageCreate',

  components: {
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

    const api = useApi()
    const loading = ref(false)

    const item = ref<NewPage>({
      content: '',
      type: 'raw_html',
      slug: '',
      name: '',
      customer_group: []
    })

    const { template } = route.params
    const redirectBack = computed(() => ({ name: 'pages', query: { template, sort: ['-created_at'] } }))

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true

      api.cms
        .createPage(route.params.template, item.value)
        .then(({ id }) => {
          addSuccessToast(t('Created page'))
          router.push({ name: 'page-update', params: { template: route.params.template, id } }).catch()
        })
        .catch((err) => addErrorToast(err.response?.data.message || t('Unable to create page')))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      loading,
      redirectBack,
      createHandler
    }
  }
})
</script>
