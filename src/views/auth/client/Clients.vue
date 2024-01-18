<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Clients') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-client" depressed color="primary" :to="{ name: 'client-create' }">
        {{ $t('Add new client') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'client-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'client-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <client-action-delete :value="item" icon @success="onDeleteSuccess" @error="onRequestError" />
    </template>
    <template #item.code="{ value }">
      <code class="text-no-wrap">{{ value }}</code>
    </template>
    <template #item.providers="{ value }">
      <span>{{ Array.isArray(value) ? value.join(', ') : '' }}</span>
    </template>
    <template #item.roles="{ value }">
      <template v-if="Array.isArray(value)">
        <span v-html="value.map((role) => `<span class='text-no-wrap'>${role.name}</span>`).join('<br />')" />
      </template>
      <template v-else>
        <span>{{ $t('N/A') }}</span>
      </template>
    </template>
    <template #item.permissions="{ value }">
      <template v-if="Array.isArray(value)">
        <span v-html="value.map((role) => `<span class='text-no-wrap'>${role.name}</span>`).join('<br />')" />
      </template>
      <template v-else>
        <span>{{ $t('N/A') }}</span>
      </template>
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ClientActionDelete from '@/components/domains/auth/clients/actions/ClientActionDelete.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { ClientGridRequest } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Clients',

  components: {
    GridLayout,
    ButtonAction,
    ClientActionDelete
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const params = useQueryFromUrl<ClientGridRequest>({ sort: ['-created_at'] })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        reloadCollection()
      } else {
        addErrorToast(data.message)
      }
    }

    const reloadCollection = (gridParams?: ClientGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.auth
        .clients({ ...params.value, include: ['roles', 'permissions'] })
        .then((value) => {
          grid.data = value.data
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const { canCreate, canUpdate, canDelete } = useCrudChecker('auth\\client')

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('ID'), value: 'id' },
        { text: t('Organisation'), value: 'organisation', align: 'center' },
        { text: t('Code'), value: 'code' },
        { text: t('Providers'), value: 'providers' },
        { text: t('Roles'), value: 'roles' },
        { text: t('Permissions'), value: 'permissions' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }
      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', label: t('Name'), code: 'name' }
      ]

      return {
        headers,
        filters
      }
    })

    return {
      params,
      options,
      grid,
      canCreate,
      onDeleteSuccess,
      reloadCollection,
      onRequestError
    }
  }
})
</script>
