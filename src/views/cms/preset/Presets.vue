<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Presets') }" @paramsChanged="reloadCollection">
    <template #actions>
      <div class="justify-end">
        <preset-import-dialog @onSuccess="reloadCollection">
          <template #default="{ on, attrs, isOpen }">
            <v-btn v-if="canUpdate && canCreate" depressed color="primary" v-bind="attrs" :disabled="isOpen" v-on="on">
              {{ $t('Import') }}
            </v-btn>
          </template>
        </preset-import-dialog>
      </div>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
    <template #item.actions="{ item }">
      <preset-export-dialog :value="item">
        <template #default="{ on, attrs }">
          <v-btn icon fab small color="primary" v-bind="attrs" v-on="on">
            <v-icon>download</v-icon>
          </v-btn>
        </template>
      </preset-export-dialog>
    </template>
    <template #item.delete="{ item }">
      <preset-action-delete :value="item" icon @onSuccess="reloadCollection" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate } from '@/libs/tables/grid'
import { useCmsPresetChecker } from '@/composable/useCms'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import GridLayout from '@/components/layouts/GridLayout.vue'
import PresetActionDelete from '@/components/domains/cms/actions/PresetActionDelete.vue'
import PresetExportDialog from '@/components/domains/cms/dialogs/preset/PresetExportDialog.vue'
import PresetImportDialog from '@/components/domains/cms/dialogs/preset/PresetImportDialog.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PresetGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'Presets',

  components: {
    GridLayout,
    PresetActionDelete,
    PresetImportDialog,
    PresetExportDialog
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()

    const grid = reactive<Grid>(gridTemplate())
    const api = useApi()

    const { canReadOrganisationPresets } = useCmsPresetChecker('preset')
    const { canCreate, canUpdate, canRead, canDelete } = useCrudChecker('cms\\preset')

    if (!(canReadOrganisationPresets.value && canRead.value)) {
      const { organisation, store } = route.params
      router.push({ name: 'dashboard', params: { organisation, store } })
    }

    const params = useQueryFromUrl<PresetGridRequest>({ sort: ['-created_at'] })

    const reloadCollection = (gridParams?: PresetGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .presets(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code', sortable: false },
        { text: t('Version'), value: 'version' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: FilterDefinition[] = [
        { type: 'text', code: 'code', label: t('Code') },
        { type: 'text', code: 'name', label: t('Name') },
        { type: 'text', code: 'type', label: t('Type') }
      ]

      return {
        headers,
        filters
      }
    })

    return {
      canUpdate,
      canCreate,
      params,
      options,
      grid,
      reloadCollection
    }
  }
})
</script>
