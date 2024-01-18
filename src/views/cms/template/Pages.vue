<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Preset Blocks') }" @paramsChanged="reloadCollection">
    <template #actions>
      <div class="d-flex justify-end flex-gap-16 align-center">
        <cms-template-select dense :value="currentTemplate" @input="onTemplateSelect" />
        <v-btn
          v-if="canCreate && currentTemplate"
          depressed
          color="primary"
          :to="{ name: 'page-create', params: { template: currentTemplate } }"
        >
          <span>{{ $t('Add new page') }}</span>
        </v-btn>
      </div>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'page-update', params: { template: currentTemplate, id: item.id } }">
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
        :to="{ name: 'page-update', params: { template: currentTemplate, id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <template-page-action-delete
        v-if="canDelete && !item.protected"
        :code="currentTemplate"
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
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CmsTemplateSelect from '@/components/domains/cms/CmsTemplateSelect.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import TemplatePageActionDelete from '@/components/domains/cms/actions/TemplatePageActionDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { PageGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'Pages',

  components: {
    GridLayout,
    TemplatePageActionDelete,
    ButtonAction,
    CmsTemplateSelect
  },

  setup() {
    const { t } = useI18n()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    grid.loading = true

    const { canCreate, canUpdate, canDelete } = useCrudChecker('cms\\page')

    const params = useQueryFromUrl<PageGridRequest & { template?: string }>({ sort: ['-created_at'] })
    const currentTemplate = computed(() => params.value.template || '')

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: PageGridRequest & { template?: string }): void => {
      if (!currentTemplate.value && !gridParams?.template) {
        grid.loading = false
        return
      }

      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .pages(currentTemplate.value.toString(), params.value)
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

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })

      const filters: FilterDefinition[] = [
        { type: 'text', code: 'slug', label: t('Slug') },
        { type: 'text', code: 'name', label: t('Name') },
        { type: 'text', code: 'type', label: t('Type') }
      ]

      return {
        headers,
        filters
      }
    })

    const onTemplateSelect = (template: string) => {
      reloadCollection({
        ...params.value,
        template,
        perPage: params.value.perPage || 10
      })
    }

    return {
      currentTemplate,
      canCreate,
      canDelete,
      params,
      options,
      grid,
      onDeleteSuccess,
      onTemplateSelect,
      reloadCollection
    }
  }
})
</script>
