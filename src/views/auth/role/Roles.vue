<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Roles') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-role" depressed color="primary" :to="{ name: 'role-create' }">
        {{ $t('Add new role') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'role-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.scope="{ item }">
      {{ getScope(item) }}
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'role-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <role-action-delete :value="item" icon @success="onDeleteSuccess" @error="onRequestError" />
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
import GridLayout from '@/components/layouts/GridLayout.vue'
import RoleActionDelete from '@/components/domains/auth/roles/actions/RoleActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { RoleGridRequest } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'Roles',
  components: {
    GridLayout,
    ButtonAction,
    RoleActionDelete
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const { canCreate, canUpdate, canDelete } = useCrudChecker('auth\\role')

    const params = useQueryFromUrl<RoleGridRequest>({ sort: ['-created_at'] })

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

    const reloadCollection = (gridParams?: RoleGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.auth
        .roles(params.value)
        .then((value) => {
          grid.data = value.data
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }
      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'name', label: t('Name') }
      ]

      return {
        headers,
        filters
      }
    })

    return {
      canCreate,
      params,
      options,
      grid,
      onDeleteSuccess,
      reloadCollection,
      onRequestError
    }
  }
})
</script>
