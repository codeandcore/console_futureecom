<template>
  <scrollable-resource :items="tabs">
    <template #header>
      <resource-header :header="$t('Preset Template Settings')">
        <template #actions>
          <div>
            <cms-preset-select dense :value="currentPreset" @input="onPresetInput" />
          </div>
        </template>
      </resource-header>
      <v-divider />
    </template>
    <template v-for="tab in tabs" #[`content-${tab.code}`]>
      <div :key="`content-${tab.code}-${loading}`" class="d-flex flex-column align-center">
        <settings-tab v-if="(settings || []).length" v-model="settings" :code="tab.code" class="my-6 col-10" />
      </div>
    </template>
    <div />
  </scrollable-resource>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import CmsPresetSelect from '@/components/domains/cms/CmsPresetSelect.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import SettingsTab from '@/components/domains/cms/SettingsTab.vue'
import useApi from '@/composable/useApi'
import type { Setting } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'

export default defineComponent({
  name: 'PresetTemplateSettings',

  components: {
    ResourceHeader,
    ScrollableResource,
    CmsPresetSelect,
    SettingsTab
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const api = useApi()
    const currentPreset = ref(`${route.params.preset}`)

    const settings = ref<Setting[]>()
    const tabs = ref<TabNavigationRoute[]>([])
    const loading = ref(false)

    const { canReadOrganisationPresets } = useCmsPresetChecker('setting')
    const { canRead } = useCrudChecker('cms\\setting')

    if (!(canReadOrganisationPresets.value && canRead.value)) {
      const { organisation, store } = route.params
      router.push({ name: 'dashboard', params: { organisation, store } })
    }

    const reloadCollection = (): void => {
      if (!canRead.value) {
        return
      }

      loading.value = true

      api.cms
        .presetSettings(currentPreset.value, { perPage: -1 })
        .then((val) => {
          //@ts-expect-error TODO: https://futureecom.atlassian.net/browse/FT-1531
          settings.value = val.data
          tabs.value = val.data.reduce<TabNavigationRoute[]>((prev, curr) => {
            const code = curr.code.split('.')[0]
            const name = code.replaceAll('_', ' ').replaceAll('-', ' ')
            return prev.find((item) => item.code === code) ? prev : [...prev, { code, name, component: SettingsTab }]
          }, [])
        })
        .finally(() => (loading.value = false))
    }

    const onPresetInput = (preset: string) => {
      currentPreset.value = preset
      reloadCollection()
      if (currentPreset.value !== route.params.preset) {
        router.push({ name: 'preset-settings', params: { preset } }).catch()
      }
    }

    return {
      tabs,
      currentPreset,
      settings,
      loading,
      onPresetInput
    }
  }
})
</script>
