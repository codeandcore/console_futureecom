<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Preset Blocks') }" @paramsChanged="reloadCollection">
    <template #actions>
      <div class="justify-end">
        <cms-preset-select dense :value="currentPreset" @input="onPresetSelect" />
      </div>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'preset-block-update', params: { preset: currentPreset, id: item.id } }">
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
        :to="{ name: 'preset-block-update', params: { preset: currentPreset, id: item.id } }"
      />
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
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CmsPresetSelect from '@/components/domains/cms/CmsPresetSelect.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { BlockGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'PresetBlocks',

  components: {
    GridLayout,
    ButtonAction,
    CmsPresetSelect
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { t } = useI18n()

    const api = useApi()
    const grid = reactive<Grid>(gridTemplate())

    grid.loading = true

    const { canReadOrganisationPresets } = useCmsPresetChecker('block')
    const { canRead, canUpdate } = useCrudChecker('cms\\block')

    if (!(canReadOrganisationPresets.value && canRead.value)) {
      const { organisation, store } = route.params
      router.push({ name: 'dashboard', params: { organisation, store } })
    }

    const params = useQueryFromUrl<BlockGridRequest & { preset?: string }>({ sort: ['-created_at'] })
    const currentPreset = computed(() => params.value.preset || '')

    const reloadCollection = (gridParams?: BlockGridRequest & { preset?: string }): void => {
      if (!currentPreset.value && !gridParams?.preset) {
        grid.loading = false
        return
      }

      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.cms
        .presetBlocks(currentPreset.value, params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Block name'), value: 'name' },
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
      currentPreset,
      params,
      options,
      grid,
      onPresetSelect,
      reloadCollection
    }
  }
})
</script>
