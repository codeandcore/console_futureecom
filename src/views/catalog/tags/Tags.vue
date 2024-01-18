<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Tags') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-tag" depressed color="primary" :to="{ name: 'tag-create' }">
        {{ $t('Add new tag') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'tag-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'tag-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <tag-action-delete icon :value="item" @success="onDeleteSuccess" @error="onRequestError" />
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
import TagActionDelete from '@/components/domains/catalog/tags/actions/TagActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { TagGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'Tags',

  components: {
    TagActionDelete,
    ButtonAction,
    GridLayout
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const params = useQueryFromUrl<TagGridRequest>({ sort: ['-created_at'] })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\tag')

    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

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

    const reloadCollection = (gridParams?: TagGridRequest): void => {
      params.value = { ...params.value, ...gridParams }

      api.catalog
        .tags(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .catch((err) => onRequestError(err))
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'name', label: t('Name') },
        { type: 'date', code: 'created_at', label: t('Created At') },
        { type: 'date', code: 'updated_at', label: t('Updated At') }
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
