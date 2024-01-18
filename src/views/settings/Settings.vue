<template>
  <v-container fluid class="fill-height my-0 py-0 px-0">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0" cols="4">
        <scrollable class="my-0 py-0" height="calc(100vh - 64px)">
          <template #sticky>
            <v-card flat>
              <v-card-title class="mx-0">
                <span>{{ $t('Settings') }}</span>
              </v-card-title>
            </v-card>
          </template>
          <template #scrollable>
            <tab-navigation-route-menu :key="$route.params.option" v-model="selectedTabIndex" :items="tabs" />
          </template>
        </scrollable>
      </v-col>

      <v-divider vertical class="foreground-divider" />

      <v-col class="ma-0 pa-0 col-8 col-lg-8">
        <v-slide-x-transition mode="out-in">
          <v-tabs-items v-if="settings" v-model="selectedTabIndex" class="my-0 py-0">
            <template v-for="(tabItem, index) in tabs">
              <v-tab-item :key="tabItem.code" class="my-0 py-0">
                <component
                  :is="tabItem.component"
                  v-if="selectedTabIndex === index && tabItem.component && tabItem.submit"
                  :value="settings"
                  @submit="updateSetting"
                >
                  <template v-if="tabItem.header" #header="{ valid }">
                    <div class="d-flex justify-space-between pa-4 align-center">
                      <span>{{ $t(tabItem.header) }}</span>
                      <v-btn
                        depressed
                        :disabled="!valid || !$canAny(...tabItem.permissions)"
                        :loading="loading"
                        :type="'submit'"
                        color="primary"
                      >
                        {{ $t('Update') }}
                      </v-btn>
                    </div>
                  </template>
                </component>
                <component
                  :is="tabItem.component"
                  v-else-if="selectedTabIndex === index && tabItem.component && !tabItem.submit"
                  :value="settings"
                />
              </v-tab-item>
            </template>
          </v-tabs-items>
          <v-container v-else>
            <v-skeleton-loader type="image" class="my-3" />
            <v-skeleton-loader type="image" class="my-3" />
            <v-skeleton-loader type="image" class="my-3" />
          </v-container>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SettingsAuth from '@/components/domains/settings/SettingsAuth.vue'
import SettingsCatalog from '@/components/domains/settings/SettingsCatalog.vue'
import SettingsCustomer from '@/components/domains/settings/SettingsCustomer.vue'
import SettingsLocalisation from '@/components/domains/settings/SettingsLocalisation.vue'
import SettingsNotification from '@/components/domains/settings/SettingsNotification.vue'
import SettingsPlugins from '@/components/domains/settings/SettingsPlugins.vue'
import SettingsTranslationLanguages from '@/components/domains/settings/SettingsTranslationLanguages.vue'
import SettingsWorkflow from '@/components/domains/settings/SettingsWorkflow.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import useApi from '@/composable/useApi'
import type { SettingsInterface } from '@/types/Settings'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'

export default defineComponent({
  name: 'Settings',
  components: {
    TabNavigationRouteMenu,
    Scrollable
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const selectedTabIndex = ref(0)
    const { setSettingProp, settings } = useSettings()

    const updateSetting = (settings: SettingsInterface<any>): void => {
      const { code, payload } = settings
      loading.value = true
      api.settings
        .updateSetting(code, payload)
        .then(() => {
          root.$toast.addSuccessToast(root.$t('Updated settings'))
          setSettingProp(code, payload)
        })
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to update settings')))
        .finally(() => (loading.value = false))
    }

    const tabs = ref<TabNavigationRoute[]>([
      {
        code: 'general',
        name: 'General Settings',
        to: { name: 'settings-general' },
        forwarding: true
      },
      {
        code: 'localisation',
        name: 'Localisation',
        header: 'Update localisation settings',
        permissions: ['manage,settings\\localisation', 'update,settings\\localisation'],
        component: SettingsLocalisation,
        submit: true
      },
      {
        code: 'translation',
        name: 'Translation languages',
        permissions: ['manage,settings\\language', 'update,settings\\language'],
        component: SettingsTranslationLanguages,
        submit: false
      },
      {
        code: 'auth',
        name: 'Auth',
        header: 'Update auth settings',
        permissions: ['manage,settings\\auth', 'update,settings\\auth'],
        component: SettingsAuth,
        submit: true
      },
      {
        code: 'catalog',
        name: 'Catalog',
        header: 'Update catalog settings',
        permissions: ['manage,settings\\catalog', 'update,settings\\catalog'],
        component: SettingsCatalog,
        submit: true
      },
      {
        code: 'customers',
        name: 'Customers',
        header: 'Update customer settings',
        permissions: ['manage,settings\\customers', 'update,settings\\customers'],
        component: SettingsCustomer,
        submit: true
      },
      {
        code: 'plugins',
        component: SettingsPlugins,
        name: 'Plugins',
        forwarding: false
      },
      {
        code: 'notifications',
        name: 'Notifications',
        permissions: ['manage,settings\\notifications', 'update,settings\\notifications'],
        component: SettingsNotification,
        submit: false
      },
      {
        code: 'workflows',
        component: SettingsWorkflow,
        name: 'Workflows',
        submit: false
      }
    ])

    return {
      loading,
      settings,
      tabs,
      selectedTabIndex,
      updateSetting
    }
  }
})
</script>
