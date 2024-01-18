<template>
  <scrollable-resource :items="tabs">
    <template #header>
      <resource-header :header="$t('Template Settings')">
        <template #actions>
          <div>
            <cms-template-select :value="currentTemplate" @input="onTemplateSelect" />
          </div>
        </template>
      </resource-header>
      <v-divider />
    </template>
    <template v-for="tab in tabs" #[`content-${tab.code}`]>
      <div :key="`content-${tab.code}-${loading}`" class="d-flex flex-column align-center">
        <component
          :is="tab.component"
          v-if="(settings || []).length"
          v-model="settings"
          :code="tab.code"
          class="my-6 col-10"
        />
      </div>
    </template>
    <div />
  </scrollable-resource>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import CmsTemplateSelect from '@/components/domains/cms/CmsTemplateSelect.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import SettingsTab from '@/components/domains/cms/SettingsTab.vue'
import useApi from '@/composable/useApi'
import type { Setting } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'

export default defineComponent({
  name: 'TemplateSettings',
  components: {
    ResourceHeader,
    ScrollableResource,
    CmsTemplateSelect
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const api = useApi()
    const currentTemplate = ref(`${route.query.template}`)

    const settings = ref<Setting[]>()
    const tabs = ref<TabNavigationRoute[]>([])
    const loading = ref(false)

    const reloadCollection = (code: string): void => {
      loading.value = true

      api.cms
        .settings(code, { perPage: -1 })
        .then((val) => {
          settings.value = val.data
          tabs.value = val.data.reduce<TabNavigationRoute[]>((prev, curr) => {
            const code = curr.code.split('.')[0]
            const name = code.replaceAll('_', ' ').replaceAll('-', ' ')
            return prev.find((item) => item.code === code) ? prev : [...prev, { code, name, component: SettingsTab }]
          }, [])
        })
        .finally(() => (loading.value = false))
    }

    const onTemplateSelect = (template: string) => {
      currentTemplate.value = template
      reloadCollection(currentTemplate.value)
      if (currentTemplate.value !== route.params.template) {
        router.push({ name: 'template-settings', params: { template } }).catch()
      }
    }

    return {
      tabs,
      currentTemplate,
      settings,
      loading,
      onTemplateSelect
    }
  }
})
</script>
