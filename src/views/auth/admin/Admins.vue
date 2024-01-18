<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Admins') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-admin" depressed color="primary" :to="{ name: 'admin-create' }">
        {{ $t('Add new Admin') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'admin-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'admin-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <user-action-delete :value="item" icon @success="onDeleteSuccess" @error="onRequestError" />
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
import { useRoute } from '@/composable/migrateUseRoute'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import UserActionDelete from '@/components/domains/auth/users/actions/UserActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { UserGridRequest } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'Admins',
  components: {
    GridLayout,
    ButtonAction,
    UserActionDelete
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi({ organisation: Number(`${useRoute().params.organisation}`), store: 0 })
    const grid = reactive<Grid>(gridTemplate())

    const { canCreate, canUpdate, canDelete } = useCrudChecker('auth\\user')

    const params = useQueryFromUrl<UserGridRequest>({ sort: ['-created_at'] })

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

    const reloadCollection = (gridParams?: UserGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.auth
        .users(params.value)
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
        { text: t('Email'), value: 'email' },
        { text: t('Type'), value: 'type' },
        { text: t('Created At'), value: 'created_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }
      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'email', label: t('Email') },
        { type: 'text', code: 'customer_id', label: t('Customer ID') },
        { type: 'date', code: 'created_at', label: t('Created at') }
      ]

      return {
        headers,
        filters
      }
    })

    return {
      params,
      canCreate,
      options,
      grid,
      reloadCollection,
      onDeleteSuccess,
      onRequestError
    }
  }
})
</script>
