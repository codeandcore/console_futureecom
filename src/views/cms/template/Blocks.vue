<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Template Blocks') }" @paramsChanged="reloadCollection">
    <template #actions>
      <div class="justify-end">
        <cms-template-select :value="currentTemplate" @input="onTemplateSelect" />
      </div>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'block-update', params: { template: currentTemplate, id: item.id } }">
        {{ item.name }}
      </router-link>
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
        :to="{ name: 'block-update', params: { template: currentTemplate, id: item.id } }"
      />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CmsTemplateSelect from '@/components/domains/cms/CmsTemplateSelect.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { BlockGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Blocks',

  components: {
    GridLayout,
    ButtonAction,
    CmsTemplateSelect
  },

  setup() {
    const { t } = useI18n()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    const { canUpdate } = useCrudChecker('cms\\block')

    const params = useQueryFromUrl<BlockGridRequest & { template?: string }>({ sort: ['-created_at'] })
    const currentTemplate = computed(() => params.value.template || '')

    grid.loading = true

    const reloadCollection = (gridParams?: BlockGridRequest & { template?: string }): void => {
      if (!currentTemplate.value && !gridParams?.template) {
        grid.loading = false
        return
      }

      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .blocks(currentTemplate.value, params.value)
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
        { text: t('Type'), value: 'type' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
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

    const onTemplateSelect = (template: string) => {
      reloadCollection({
        ...params.value,
        template,
        perPage: params.value.perPage || 10
      })
    }
    return {
      currentTemplate,
      params,
      onTemplateSelect,
      reloadCollection,
      options,
      grid
    }
  }
})
</script>
