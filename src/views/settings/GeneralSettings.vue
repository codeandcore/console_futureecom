<template>
  <v-container fluid class="fill-height my-0 py-0 px-0">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0" cols="4">
        <scrollable class="my-0 py-0" height="calc(100vh - 64px)">
          <template #sticky>
            <v-card flat>
              <v-card-title class="mx-0">
                <span>{{ $t('General Settings') }}</span>
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
                  v-if="selectedTabIndex === index && tabItem.component"
                  :value="settings.general"
                  class="mx-0 px-0"
                  :loading="loading"
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
import GeneralSettingsBrand from '@/components/domains/settings/general/GeneralSettingsBrand.vue'
import GeneralSettingsCheckout from '@/components/domains/settings/general/GeneralSettingsCheckout.vue'
import GeneralSettingsCloudinary from '@/components/domains/settings/general/GeneralSettingsCloudinary.vue'
import GeneralSettingsContact from '@/components/domains/settings/general/GeneralSettingsContact.vue'
import GeneralSettingsCurrency from '@/components/domains/settings/general/GeneralSettingsCurrency.vue'
import GeneralSettingsCustomer from '@/components/domains/settings/general/GeneralSettingsCustomer.vue'
import GeneralSettingsDateFormat from '@/components/domains/settings/general/GeneralSettingsDateFormat.vue'
import GeneralSettingsLocale from '@/components/domains/settings/general/GeneralSettingsLocale.vue'
import GeneralSettingsOrder from '@/components/domains/settings/general/GeneralSettingsOrder.vue'
import GeneralSettingsQuote from '@/components/domains/settings/general/GeneralSettingsQuote.vue'
import GeneralSettingsTaxes from '@/components/domains/settings/general/GeneralSettingsTaxes.vue'
import GeneralSettingsTimezone from '@/components/domains/settings/general/GeneralSettingsTimezone.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import useApi from '@/composable/useApi'
import type { SettingsInterface } from '@/types/Settings'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'
import type { abilities } from '@/types/Abilities'

export default defineComponent({
  name: 'SettingsGeneral',
  components: {
    Scrollable,
    TabNavigationRouteMenu
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

    const defaultPermissionSetting: abilities[] = ['manage,settings\\general', 'update,settings\\general']

    const tabs: TabNavigationRoute[] = [
      {
        code: '',
        name: 'Settings',
        to: { name: 'settings' }
      },
      {
        code: 'contact',
        name: 'Contact Address',
        header: 'Update store contact address',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsContact,
        submit: true
      },
      {
        code: 'currency',
        name: 'Currency',
        header: 'Update currency settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsCurrency,
        submit: true
      },
      {
        code: 'checkout',
        name: 'Checkout',
        header: 'Update checkout settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsCheckout,
        submit: true
      },
      {
        code: 'quote',
        name: 'Quote',
        header: 'Update quote settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsQuote,
        submit: true
      },
      {
        code: 'locale',
        name: 'Locale',
        header: 'Update locale settings',
        permissions: ['update,settings\\localisation', 'manage,settings\\localisation'],
        component: GeneralSettingsLocale,
        submit: true
      },
      {
        code: 'date-format',
        name: 'Date Formats',
        header: 'Update date format settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsDateFormat,
        submit: true
      },
      {
        code: 'timezone',
        name: 'Timezone',
        header: 'Update timezone settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsTimezone,
        submit: true
      },
      {
        code: 'customers',
        name: 'Customers',
        header: 'Update customer settings',
        permissions: ['update,settings\\customers', 'manage,settings\\customers'],
        component: GeneralSettingsCustomer,
        submit: true
      },
      {
        code: 'brand',
        name: 'Brand',
        header: 'Update brand settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsBrand,
        submit: true
      },
      {
        code: 'cloudinary',
        name: 'Cloudinary',
        header: 'Update cloudinary settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsCloudinary,
        submit: true
      },
      {
        code: 'orders',
        name: 'Orders',
        header: 'Update orders settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsOrder,
        submit: true
      },
      {
        code: 'taxes',
        name: 'Taxes',
        header: 'Update taxes settings',
        permissions: defaultPermissionSetting,
        component: GeneralSettingsTaxes,
        submit: true
      }
    ]

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
