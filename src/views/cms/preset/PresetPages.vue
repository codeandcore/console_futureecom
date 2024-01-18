<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Preset Pages') }" @paramsChanged="reloadCollection">
    <template #actions>
      <div class="d-flex justify-end flex-gap-16 align-center">
        <cms-preset-select dense :value="currentPreset" @input="onPresetSelect" />
        <v-btn
          v-if="canCreate && currentPreset"
          depressed
          color="primary"
          :to="{ name: 'preset-page-create', params: { preset: currentPreset } }"
        >
          <span>{{ $t('Add new preset page') }}</span>
        </v-btn>
      </div>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'preset-page-update', params: { id: item.id, preset: currentPreset } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.protected="{ item }">
      <v-icon>{{ item.protected ? 'done' : 'close' }}</v-icon>
    </template>
    <template #item.type="{ item }">
      <v-chip class="ma-2 text-uppercase">
        {{ item.type.replace('_', ' ') }}
      </v-chip>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'preset-page-update', params: { preset: currentPreset, id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <preset-page-action-delete
        v-if="canDelete && !item.protected"
        :code="currentPreset"
        :value="item"
        icon
        @onSuccess="onDeleteSuccess"
      />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CmsPresetSelect from '@/components/domains/cms/CmsPresetSelect.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import PresetPageActionDelete from '@/components/domains/cms/actions/PresetPageActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PageGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'PresetPages',

  components: {
    GridLayout,
    PresetPageActionDelete,
    ButtonAction,
    CmsPresetSelect
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const { canReadOrganisationPresets } = useCmsPresetChecker('page')
    const { canRead, canCreate, canUpdate, canDelete } = useCrudChecker('cms\\page')

    if (!(canReadOrganisationPresets.value && canRead.value)) {
      const { organisation, store } = route.params
      router.push({ name: 'dashboard', params: { organisation, store } })
    }

    const params = useQueryFromUrl<PageGridRequest & { preset?: string }>({ sort: ['-created_at'] })
    const currentPreset = computed(() => params.value.preset || '')

    grid.loading = true

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: PageGridRequest & { preset?: string }): void => {
      if (!currentPreset.value && !gridParams?.preset) {
        grid.loading = false
        return
      }

      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .presetPages(currentPreset.value.toString(), params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Page name'), value: 'name' },
        { text: t('Slug'), value: 'slug', sortable: false },
        { text: t('Type'), value: 'type' },
        { text: t('Protected'), value: 'protected' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition[] = [
        { type: 'text', code: 'slug', label: t('Slug') },
        { type: 'text', code: 'name', label: t('Name') },
        { type: 'text', code: 'type', label: t('type') }
      ]

      return {
        headers,
        filters
      }
    })

    const onPresetSelect = (preset: string) => {
      reloadCollection({
        ...params.value,
        preset,
        perPage: params.value.perPage || 10
      })
    }

    return {
      canCreate,
      canDelete,
      currentPreset,
      options,
      params,
      grid,
      onPresetSelect,
      onDeleteSuccess,
      reloadCollection
    }
  }
})
</script>
