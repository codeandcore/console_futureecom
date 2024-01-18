<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Zones') }}</span>
          <v-btn
            v-if="$canAny('manage,zones\\zone', 'create,zones\\zone')"
            data-cy="add-new-zone"
            depressed
            color="primary"
            :to="{ name: 'zone-create' }"
          >
            {{ $t('Add new zone') }}
          </v-btn>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <resource-grid
          v-model="params"
          :options="options"
          :items="grid.data"
          hide-default-footer
          @onParamsChange="reloadCollection"
        >
          <template #item.label="{ item }">
            <router-link
              :is="canAccessZone ? 'router-link' : 'span'"
              :to="{ name: 'zone-update', params: { id: item.id } }"
            >
              {{ item.label }}
            </router-link>
          </template>
          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'zone-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <zone-action-delete :value="item" icon @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-end">
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import ZoneActionDelete from '@/components/domains/zones/actions/ZoneActionDelete.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { ZonesGridRequest } from '@futureecom/futureecom-js/dist/services/zone-service'

export default defineComponent({
  name: 'Zones',

  components: { TablePagination, ButtonAction, Scrollable, ZoneActionDelete, ResourceGrid },

  setup(props, { root }) {
    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()
    const collection = collectionLoader()

    const params = computed<ZonesGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: ZonesGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.zones
        .zones(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Label'), value: 'label' },
        { text: ctx.$t('Code'), value: 'code' }
      ]

      if (canAccessZone.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'label', label: ctx.$t('Label') },
        { type: 'text', code: 'code', label: ctx.$t('Code') }
      ]

      return {
        headers,
        filters,
        meta: collection.metadata.value,
        loading: collection.loading.value
      }
    })

    const canAccessZone = computed((ctx) => {
      return ctx.$canAny('manage,zones\\zone', 'delete,zones\\zone', 'update,zones\\zone').value
    })

    const canDelete = computed((ctx) => ctx.$canAny('manage,zones\\zone', 'delete,zones\\zone').value)

    return {
      params,
      onDeleteSuccess,
      reloadCollection,
      options,
      grid,
      canAccessZone
    }
  }
})
</script>
