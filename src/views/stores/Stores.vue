<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Stores') }">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-store" depressed color="primary" :to="{ name: 'store-create' }">
        {{ $t('Add new store') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'store-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.color="{ item }">
      <v-icon :color="item.color" large>bookmark</v-icon>
    </template>
    <template #item.domain.default="{ item }">
      <external-link :label="item.domain.default" :value="item.domain.default" />
    </template>
    <template #item.domain.custom="{ item }">
      <external-link v-if="item.domain.custom" :label="item.domain.custom" :value="item.domain.custom" />
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'store-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <store-action-delete icon :value="item" @success="refetchStores" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import { useStores } from '@/composable/repositories/useStores'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ExternalLink from '@/components/common/ExternalLink.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import StoreActionDelete from '@/components/domains/stores/actions/StoreActionDelete.vue'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Stores',

  components: {
    GridLayout,
    ButtonAction,
    StoreActionDelete,
    ExternalLink
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const router = useRouter()
    const route = useRoute()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('settings\\stores')
    const { collection, fetchStores, loadingStores } = useStores()

    const grid = computed((): Partial<Grid> => ({ data: collection.value, loading: loadingStores.value }))

    const params = useQueryFromUrl<Record<string, any>>({ perPage: -1 })

    const { organisation, store } = route.params

    if (route.params.organisation === '0') {
      router.push({ name: 'dashboard', params: { organisation, store } })
    }

    const refetchStores = () => fetchStores(Number(organisation))

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        refetchStores()
      } else {
        addErrorToast(data.message)
      }
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name', sortable: false },
        { text: t('Code'), value: 'code', sortable: false },
        { text: t('Color'), value: 'color', sortable: false },
        { text: t('Default domain'), value: 'domain.default', sortable: false },
        { text: t('Custom domain'), value: 'domain.custom', sortable: false }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      return {
        headers
      }
    })

    refetchStores()

    return {
      params,
      options,
      grid,
      canCreate,
      onRequestError,
      refetchStores
    }
  }
})
</script>
