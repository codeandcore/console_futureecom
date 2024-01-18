<template>
  <div>
    <toggle-overview-mode v-if="isOverviewType" :value="isOverview" @input="onOverviewModeChange" />
    <div class="d-flex flex-column flex-gap-16 my-2 text-white store_select">
      <select-app-organisation
        v-if="isOverviewType"
        :disabled="isOverview"
        :value="currentOrganisation"
        @input="onOrganisationChange"
      />
      <select-app-store :disabled="isOverview" :value="currentStore" @input="onStoreChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { isOverviewType } from '@/libs/isOverview'
import { useI18n } from 'vue-i18n-bridge'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useStores } from '@/composable/repositories/useStores'
import SelectAppOrganisation from '@/components/layouts/dashboard/SelectAppOrganisation.vue'
import SelectAppStore from '@/components/layouts/dashboard/SelectAppStore.vue'
import ToggleOverviewMode from '@/components/layouts/dashboard/ToggleOverviewMode.vue'
import isOverview, { setOverviewMode, zeroOrganisation } from '@/composable/repositories/useOverview'
import type { Organisation, Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'SelectAppTenancy',

  components: { ToggleOverviewMode, SelectAppOrganisation, SelectAppStore },

  setup() {
    const { t } = useI18n()

    const route = useRoute()
    const router = useRouter()

    const { organisation: routeOrganisation, store: routeStore } = route.params
    setOverviewMode(!Number(routeOrganisation))

    const { currentOrganisation, collection: organisations } = useOrganisations()
    const { currentStore, getStore, collection: stores } = useStores()
    const { fetchStores } = useStores()

    const setTenancyParams = () => {
      const { organisation: storeOrg, id: storeId } = currentStore.value || {}
      const routeOrg = isOverview.value ? '0' : routeOrganisation
      const organisation = String(storeOrg || currentOrganisation.value?.id || routeOrg)
      const store = String(storeId || '0')
      router.push({ params: { organisation, store }, query: { ...route.query } }).catch(Boolean)
    }

    const onOverviewModeChange = (val: boolean) => {
      if (!val) {
        setInitOrganisation()
      } else {
        currentOrganisation.value = undefined
        currentStore.value = undefined
      }

      setOverviewMode(val)
      setTenancyParams()
    }

    const onOrganisationChange = (organisation: Organisation) => {
      if (organisation.id === 0) {
        return
      }

      fetchStores(organisation.id)
        .then(() => {
          currentOrganisation.value = organisation
          setInitStore(Number(routeStore))
        })
        .catch(() => t('Unable to fetch stores for selected organisation'))
    }

    const onStoreChange = (store: Store) => {
      currentStore.value = store
      setTenancyParams()
    }

    const setInitOrganisation = (organisation?: number): void => {
      const foundOrg = organisations.value.find((org) => org.id === organisation)
      const selectedOrg = foundOrg || (organisations.value || [])[0] || zeroOrganisation

      if (selectedOrg) {
        onOrganisationChange(selectedOrg)
      }
    }

    const setInitStore = (storeId: number): void => {
      const foundStore = getStore(storeId || 0)
      onStoreChange(foundStore || stores.value[0])
    }

    if (isOverviewType && !isOverview.value) {
      setInitOrganisation(Number(`${route.params.organisation}`))
    }

    if (!isOverviewType) {
      setInitStore(Number(`${route.params.store}`))
    }

    return {
      onOverviewModeChange,
      onOrganisationChange,
      onStoreChange,
      currentStore,
      currentOrganisation,
      isOverview,
      isOverviewType
    }
  }
})
</script>
