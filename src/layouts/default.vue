<template>
  <div>
    <v-app-bar color="primary" fixed dark app clipped-left clipped-right flat>
      <span>
        <v-app-bar-nav-icon class="me-4"  />
        <v-btn
          v-if="$vuetify.breakpoint.smAndUp" @click.stop="toggleDrawer"
          :to="{ name: 'dashboard', params: { ...$route.params } }"
          color="transparent"
          depressed
        >
          {{ $t('Dashboard') }}
        </v-btn>
      </span>
      <span class="align-center">
        <language-switch />
        <menu-app-bar-settings v-if="!!store" />
        <menu-app-bar-account />
        <menu-app-bar-theme />
      </span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="drawerWidth" @mouseover="drawer = true" @mouseleave="drawer = false"  app :permanent="$vuetify.breakpoint.mdAndUp" clipped class="primary" :key="navDrawerPinned" :expand-on-hover="!navDrawerPinned"  rail>
      <scrollable class="primary">
        <template #scrollable>
          <navigation-menu v-if="!loading.tos && !loading.account" :key="routeKey" />          
          <v-divider class="my-4" />
          <select-tenancy class="d-flex flex-column flex-gap-16 mx-4 mt-4" />          
        </template>
      </scrollable>
    </v-navigation-drawer>

    <portal-target name="side-drawer" multiple />

    <v-main>
      <v-slide-x-reverse-transition mode="out-in">
        <div v-if="!isReady" class="d-flex justify-center my-4">
          <v-progress-circular size="32" color="primary" indeterminate />
        </div>

        <div v-else-if="showTos && !!currentTos" class="d-flex justify-center">
          <accept-tos class="col-6" :loading="loading.account" :tos="currentTos" @onAccept="onAccept" />
        </div>
        <router-view v-else :key="routeKey" class="align-start" />
      </v-slide-x-reverse-transition>
    </v-main>

    <toasts-queue />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { isSuperAdmin } from '@/libs/api'
import { loadConsolePlugins } from '@/config/consolePluginsLoader'
import { useCountries } from '@/composable/repositories/useCountries'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useMyAccount } from '@/composable/repositories/useAccount'
import { useProductPlaceholder } from '@/composable/useProductPlaceholder'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useSettings } from '@/composable/repositories/useSettings'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import { useTosGate } from '@/composable/repositories/useCurrentTos'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import AcceptTos from '@/components/layouts/dashboard/AcceptTos.vue'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import MenuAppBarAccount from '@/components/layouts/dashboard/MenuAppBarAccount.vue'
import MenuAppBarSettings from '@/components/layouts/dashboard/MenuAppBarSettings.vue'
import MenuAppBarTheme from '@/components/layouts/dashboard/MenuAppBarTheme.vue'
import NavigationMenu from '@/components/layouts/dashboard/NavigationMenu.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SelectTenancy from '@/components/layouts/dashboard/SelectTenancy.vue'
import ToastsQueue from '@/components/common/ToastsQueue.vue'
import isOverview from '@/composable/repositories/useOverview'

loadConsolePlugins()

export default defineComponent({
  name: 'DashboardLayout',

  components: {
    SelectTenancy,
    AcceptTos,
    MenuAppBarTheme,
    MenuAppBarAccount,
    MenuAppBarSettings,
    LanguageSwitch,
    NavigationMenu,
    Scrollable,
    ToastsQueue
  },

  setup: () => {
    useCountries().getCountries()

    const { t } = useI18n()
    const { addWarningToast } = useToasts()
    const router = useRouter()
    const route = useRoute()

    const { myAccount, fetchMyAccount, updateMyAccount } = useMyAccount()
    const { currentTos, fetchTos } = useTosGate()
    const { currentStore } = useStores()

    const drawer = ref(false)
    const accountErrors = ref()
    const routeKey = computed(() => [route.params.organisation, route.params.store].join('-'))

    const loading = reactive({
      config: false,
      account: true,
      tos: false
    })

    const { canRead: canReadToS } = useCrudChecker('tos\\tos')
    const { canRead: canReadCmsSettings } = useCrudChecker('cms\\setting')

    fetchMyAccount()
      .catch((err) => onAccountErrors(err))
      .finally(() => (loading.account = false))

    const onAccountErrors = (err: Error) => {
      if (accountErrors.value) {
        addWarningToast(t(`If error persists, contact your supervisor`))
      }
      accountErrors.value = err
    }

    const onAccept = (accepted_tos: number) => {
      loading.account = true
      updateMyAccount({ accepted_tos })
        .then(() => fetchMyAccount())
        .catch((err) => onAccountErrors(err))
        .finally(() => (loading.account = false))
    }

    if (!isSuperAdmin.value && canReadToS.value) {
      loading.tos = true
      fetchTos()
        .catch(() => addWarningToast(t('Unable to fetch Terms and Services')))
        .finally(() => (loading.tos = false))
    }

    const showTos = computed(() => {
      return !isSuperAdmin.value && currentTos.value?.version !== myAccount.value?.accepted_tos
    })

    const settings = useSettings()
    const init = async (): Promise<void> => {
      const { store, organisation } = route.params

      if (!isSuperAdmin.value && store === '' && organisation === '') {
        await router.push({ name: 'login' })
        return
      }

      loading.config = Number(store) > 0 && Number(organisation) > 0 && !!currentStore.value

      if (!loading.config) {
        return
      }

      const promises: Promise<void>[] = [
        useTranslationLanguages().fetchTranslationLanguages(),
        settings.fetchSettings('', true)
      ]

      if (canReadCmsSettings.value) {
        promises.push(useProductPlaceholder().fetchCmsProductPlaceholder())
      }

      Promise.all(promises)
        .catch(() => t('Unable to fetch settings'))
        .finally(() => (loading.config = false))
    }

    const isReady = computed(() => {
      const isLoading = loading.tos || loading.account || loading.config
      return isOverview.value || route.params.store === '0' ? !isLoading : !isLoading && !!settings.settings.value
    })

    const toBeWatchedForInitialization = [currentStore, () => route.params.store, () => route.params.organisation]

    watch(toBeWatchedForInitialization, () => init(), { immediate: true })

    return {
      isReady,
      routeKey,
      drawer,
      showTos,
      currentTos,
      loading,
      store: currentStore,
      onAccept
    }
  },

  data() {
    return {
      drawer: false, // Controls the visibility of the drawer
      drawerWidth: 300, // Initial width of the drawer
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
      this.drawerWidth = this.drawer ? 300 : 0; // Adjust the width as needed
    },
  },
})
</script>
