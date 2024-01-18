<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Medias') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-media" depressed color="primary" :to="{ name: 'media-create' }">
        {{ $t('Add new media') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'media-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.tags="{ item }">
      <span v-if="item.tags">{{ `${item.tags}`.replaceAll(',', ', ') }}</span>
      <span v-else class="grey--text">{{ $t('N/A') }}</span>
    </template>
    <template #item.secure_url="{ item }">
      <image-zoom>
        <template #thumbnail>
          <v-img :src="item.secure_url" height="40" width="40" />
        </template>
        <template #zoom>
          <v-img :src="item.secure_url" height="300" width="300" />
        </template>
      </image-zoom>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'media-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <media-action-delete :value="item" icon @success="onDeleteSuccess" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { mediaFilters } from '@/libs/domains/cms/media/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import ImageZoom from '@/components/common/ImageZoom.vue'
import MediaActionDelete from '@/components/domains/cms/medias/actions/MediaActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { MediaGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'Medias',
  components: {
    ImageZoom,
    MediaActionDelete,
    GridLayout,
    ButtonAction
  },

  setup() {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const { canCreate, canUpdate, canDelete } = useCrudChecker('cms\\media')

    const params = useQueryFromUrl<MediaGridRequest>({ sort: ['-created_at'] })

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

    const reloadCollection = (gridParams?: MediaGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .medias(params.value)
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
        { text: t('Image'), value: 'secure_url' },
        { text: t('Tags'), value: 'tags', sortable: false },
        { text: t('Public ID'), value: 'public_id' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }
      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition[] = mediaFilters.map((filter) => ({ ...filter, label: t(filter.label) }))

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
