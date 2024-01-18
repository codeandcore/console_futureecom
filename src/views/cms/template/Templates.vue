<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('CMS Templates') }" @paramsChanged="reloadCollection">
    <template #actions>
      <template-import-dialog @onSuccess="reloadCollection">
        <template #default="{ on, attrs, isOpen }">
          <div class="d-flex justify-end flex-gap-16">
            <v-btn v-if="canUpdate && canCreate" depressed color="primary" v-bind="attrs" :disabled="isOpen" v-on="on">
              {{ $t('Import') }}
            </v-btn>
            <v-btn v-if="canCreate" depressed color="primary" :to="{ name: 'template-create' }">
              <span>{{ $t('Create') }}</span>
            </v-btn>
          </div>
        </template>
      </template-import-dialog>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
    </template>
    <template #item.actions="{ item }">
      <template-export-dialog :value="item">
        <template #default="{ on, attrs }">
          <v-btn icon fab small color="primary" v-bind="attrs" v-on="on">
            <v-icon>download</v-icon>
          </v-btn>
        </template>
      </template-export-dialog>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'template-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <template-action-delete :value="item" icon @onSuccess="onDeleteSuccess" />
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
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import TemplateActionDelete from '@/components/domains/cms/actions/TemplateActionDelete.vue'
import TemplateExportDialog from '@/components/domains/cms/dialogs/template/TemplateExportDialog.vue'
import TemplateImportDialog from '@/components/domains/cms/dialogs/template/TemplateImportDialog.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { TemplateGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'Templates',

  components: {
    GridLayout,
    TemplateActionDelete,
    ButtonAction,
    TemplateImportDialog,
    TemplateExportDialog
  },

  setup() {
    const { t } = useI18n()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const params = useQueryFromUrl<TemplateGridRequest>({ sort: ['-created_at'] })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams: TemplateGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .templates(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const { canReadGlobalPresets } = useCmsPresetChecker('preset')
    const { canUpdate, canCreate, canDelete } = useCrudChecker('cms\\template')

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code', sortable: false },
        { text: t('Version'), value: 'version' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      if (canUpdate.value && canReadGlobalPresets.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

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
      options,
      params,
      canUpdate,
      canCreate,
      grid,
      onDeleteSuccess,
      reloadCollection
    }
  }
})
</script>
